const firebase = require('firebase')
const functions = require('firebase-functions')

const { db } = require('./util/admin')

const firebaseConfig = require('./firebase-config')

firebase.initializeApp(firebaseConfig)

exports.api = functions
  .region('europe-west1')
  .https.onRequest(require('./router'))

exports.createNotificationOnLike = functions
  .region('europe-west1')
  .firestore.document('/likes/{id}')
  .onCreate(snapshot => {
    db.doc(`/rants/${snapshot.data().rantId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            rantId: doc.id,
          })
        }
      })
      .then(() => {
        return
      })
      .catch(err => {
        console.error(err)
        return
      })
  })

exports.createNotificationOnUnlike = functions
  .region('europe-west1')
  .firestore.document('/likes/{id}')
  .onDelete(snapshot => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return
      })
      .catch(err => {
        console.error(err)
        return
      })
  })

exports.createNotificationOnComment = functions
  .region('europe-west1')
  .firestore.document('/comments/{id}')
  .onCreate(snapshot => {
    db.doc(`/rants/${snapshot.data().rantId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            rantId: doc.id,
          })
        }
      })
      .then(() => {
        return
      })
      .catch(err => {
        console.error(err)
        return
      })
  })
