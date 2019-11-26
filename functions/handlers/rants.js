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
          createdAt: doc.data().createdAt
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
    createdAt: new Date().toISOString()
  }

  db.collection('rants')
    .add(newRant)
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

module.exports = {
  getRants,
  getRant,
  createRant
}
