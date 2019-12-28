const firebase = require('firebase')
const { db, admin } = require('../util/admin')
const config = require('../firebase-config')
const firebaseConfig = require('../firebase-config')

const {
  validateSignUpData,
  validateLoginData,
  reduceUserDetails,
} = require('../helpers/validators')

const signUp = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  }

  const { valid, errors } = validateSignUpData(newUser)

  if (!valid) return res.status(400).json(errors)

  const noImage = 'blank-profile-picture.png'

  let token, userId
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ handle: 'Sorry this handle is already taken' })
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .then(data => {
      userId = data.user.uid
      return data.user.getIdToken()
    })
    .then(idToken => {
      token = idToken
      const userCredentials = {
        userId,
        email: newUser.email,
        handle: newUser.handle,
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImage}?alt=media`,
        createdAt: new Date().toISOString(),
      }
      return db.doc(`/users/${newUser.handle}`).set(userCredentials)
    })
    .then(() => {
      return res.status(201).json({ token })
    })
    .catch(err => {
      console.error(err)
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email is already in use' })
      } else {
        return res
          .status(500)
          .json({ general: 'Something went wrong, please try again' })
      }
    })
}

const login = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
  }

  const { valid, errors } = validateLoginData(newUser)

  if (!valid) return res.status(400).json(errors)

  firebase
    .auth()
    .signInWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      return data.user.getIdToken()
    })
    .then(token => {
      return res.json({ token })
    })
    .catch(err => {
      console.log(err)
      return res
        .status(403)
        .json({ general: 'Wrong credentials, please try again' })
    })
}

const addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body)
  db.doc(`users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: 'Details added successfully' })
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}

const getAuthenticatedUser = (req, res) => {
  let userData = {}
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data()
        return db
          .collection('likes')
          .where('userHandle', '==', req.user.handle)
          .get()
      }
    })
    .then(data => {
      userData.likes = []
      data.forEach(doc => {
        userData.likes.push(doc.data())
      })
      return db
        .collection('notifications')
        .where('recipient', '==', req.user.handle)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get()
    })
    .then(data => {
      userData.notifications = []

      data.forEach(doc => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          rantId: doc.data().rantId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id,
        })
      })
      return res.json(userData)
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}

const uploadImage = (req, res) => {
  const busBoy = require('busboy')
  const path = require('path')
  const os = require('os')
  const fs = require('fs')
  const BusBoy = new busBoy({ headers: req.headers })

  let imageFileName
  let imageToBeUploaded = {}

  BusBoy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: 'Wrong file type submitted' })
    }
    const imageExtension = filename.split('.')[filename.split('.').length - 1]
    imageFileName = `${Math.round(Math.random() * 100000)}.${imageExtension}`
    const filePath = path.join(os.tmpdir(), imageFileName)
    imageToBeUploaded = { filePath, mimetype }
    file.pipe(fs.createWriteStream(filePath))
  })
  BusBoy.on('finish', () => {
    admin
      .storage()
      .bucket(firebaseConfig.storageBucket)
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
        return db.doc(`/users/${req.user.handle}`).update({
          imageUrl,
        })
      })
      .then(() => {
        return res.json({ message: 'Image uploaded successfully' })
      })
      .catch(err => {
        console.log(err)
        return res.status(500).json({ error: err.code })
      })
  })
  BusBoy.end(req.rawBody)
}

const getUserDetails = (req, res) => {
  let userData = {}
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.user = doc.data()
        return db
          .collection('rants')
          .where('userHandle', '==', req.params.handle)
          .orderBy('createdAt', 'desc')
          .get()
      } else {
        return res.status(404).json({ error: 'User not found' })
      }
    })
    .then(data => {
      userData.rants = []
      data.forEach(doc => {
        userData.rants.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          userHandle: doc.data().userHandle,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          rantId: doc.id,
        })
      })
      return res.json(userData)
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}

const markNotificationsRead = (req, res) => {
  let batch = db.batch()
  req.body.forEach(notificationId => {
    const notification = db.doc(`/notifications/${notificationId}`)
    batch.update(notification, { read: true })
  })
  batch
    .commit()
    .then(() => {
      return res.json({ message: 'Notifications marked read' })
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}

module.exports = {
  signUp,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
}
