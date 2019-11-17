const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require('./service-account-key.json')
const firebaseConfig = require('./firebase-config')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const app = require('express')()

const firebase = require('firebase')
firebase.initializeApp(firebaseConfig)

app.get('/screams', (req, res) => {
  admin
    .firestore()
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let screams = []
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        })
      })
      return res.json(screams)
    })
    .catch(err => console.error(err))
})

app.post('/scream', (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  }

  admin
    .firestore()
    .collection('screams')
    .add(newScream)
    .then(doc => {
      console.log(doc)

      res.json({ message: `document ${doc.id} created successfully` })
    })
    .catch(err => {
      res.status(500).json({
        error: 'something went wrong'
      })
      console.error(err)
    })
})

app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  }
  // Todo validate data
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      return res
        .status(201)
        .json({ meessage: `user ${data.user.uid} signed up successfully` })
    })
    .catch(err => {
      return res.status(500).json({ error: err.code })
    })
})

exports.api = functions.https.onRequest(app)
