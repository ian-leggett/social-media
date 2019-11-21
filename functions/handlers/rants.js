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

module.exports = {
  getRants,
  createRant
}
