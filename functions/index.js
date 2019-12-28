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
    return db
      .doc(`/rants/${snapshot.data().rantId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch(err => {
        console.error(err)
      })
  })

exports.deleteNotificationOnUnlike = functions
  .region('europe-west1')
  .firestore.document('/likes/{id}')
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.error(err)
      })
  })

exports.createNotificationOnComment = functions
  .region('europe-west1')
  .firestore.document('/comments/{id}')
  .onCreate(snapshot => {
    return db
      .doc(`/rants/${snapshot.data().rantId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch(err => {
        console.error(err)
      })
  })

exports.onUserImageChange = functions
  .region('europe-west1')
  .firestore.document('/users/{userId}')
  .onUpdate(change => {
    console.log(change.before.data())
    console.log(change.after.data())
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed')
      let batch = db.batch()
      return db
        .collection('rants')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const rant = db.doc(`/rants/${doc.id}`)
            batch.update(rant, { userImage: change.after.data().imageUrl })
          })
          return batch.commit()
        })
    }
  })

exports.onRantDelete = functions
  .region('europe-west1')
  .firestore.document('/rants/{rantId}')
  .onDelete((snapshot, context) => {
    const rantId = context.params.rantId
    const batch = db.batch()
    return db
      .collection('comments')
      .where('rantId', '==', rantId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`))
        })
        return db.collection('likes').where('rantId', '==', rantId)
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`))
        })
        return db.collection('notifications').where('rantId', '==', rantId)
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`))
        })
        return batch.commit()
      })
      .catch(err => {
        console.log(err)
      })
  })
