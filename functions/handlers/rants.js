const admin = require('firebase-admin')
const { db } = require('../util/admin')

const getRants = (req, res) => {
  db.collection('rants')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let rants = []
      data.forEach(doc => {
        rants.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage,
        })
      })
      return res.json(rants)
    })
    .catch(err => console.error(err))
}

const createRant = (req, res) => {
  const newRant = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  }

  db.collection('rants')
    .add(newRant)
    .then(doc => {
      const resRant = newRant
      resRant.rantId = doc.id
      res.json(resRant)
    })
    .catch(err => {
      res.status(500).json({
        error: 'something went wrong',
      })
      console.error(err)
    })
}

const getRant = (req, res) => {
  let rantData
  db.doc(`/rants/${req.params.rantId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Rant not found' })
      }
      rantData = doc.data()
      rantData.rantId = doc.id
      return db
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .where('rantId', '==', req.params.rantId)
        .get()
    })
    .then(data => {
      rantData.comments = []
      data.forEach(doc => {
        rantData.comments.push(doc.data())
      })
      return res.json(rantData)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err.code })
    })
}

const commentOnRant = (req, res) => {
  if (req.body.body.trim() === '')
    return res.status(400).json({ comment: 'Comment must not be empty' })

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    rantId: req.params.rantId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
  }

  db.doc(`/rants/${req.params.rantId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Rant not found' })
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 })
    })
    .then(() => {
      return db.collection('comments').add(newComment)
    })
    .then(() => {
      res.json(newComment)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: 'Something went wrong' })
    })
}

const likeRant = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('rantId', '==', req.params.rantId)
    .limit(1)

  const rantDocument = db.doc(`/rants/${req.params.rantId}`)
  let rantData

  rantDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        rantData = doc.data()
        rantData.rantId = doc.id
        return likeDocument.get()
      } else {
        return res.status(404).json({ error: 'Rant not found' })
      }
    })
    .then(data => {
      if (data.empty) {
        return db
          .collection('likes')
          .add({
            rantId: req.params.rantId,
            userHandle: req.user.handle,
          })
          .then(() => {
            rantData.likeCount++
            return rantDocument.update({ likeCount: rantData.likeCount })
          })
          .then(() => {
            return res.json(rantData)
          })
      } else {
        return res.status(400).json({ error: 'Scream already liked' })
      }
    })
    .catch(err => {
      res.status(500).json({ error: err.code })
    })
}

const unLikeRant = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('rantId', '==', req.params.rantId)
    .limit(1)

  const rantDocument = db.doc(`/rants/${req.params.rantId}`)
  let rantData

  rantDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        rantData = doc.data()
        rantData.rantId = doc.id
        return likeDocument.get()
      } else {
        return res.status(404).json({ error: 'Rant not found' })
      }
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ error: 'Scream already not liked' })
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            rantData.likeCount--
            return rantDocument.update({ likeCount: rantData.likeCount })
          })
          .then(() => {
            res.json(rantData)
          })
      }
    })
    .catch(err => {
      res.status(500).json({ error: err.code })
    })
}

const deleteRant = (req, res) => {
  const document = db.doc(`/rants/${req.params.rantId}`)
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Rant not found' })
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthourized' })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Rant deleted successfully' })
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}

module.exports = {
  getRants,
  getRant,
  createRant,
  commentOnRant,
  likeRant,
  unLikeRant,
  deleteRant,
}
