const admin = require('firebase-admin')
const { db } = require('./util/admin')

const FBAuth = (req, res, next) => {
  let idToken
  if (
    req.headers.authourisation &&
    req.headers.authourisation.startsWith('Bearer ')
  ) {
    idToken = req.headers.authourisation.split('Bearer ')[1]
  } else {
    console.log('No token found')
    return res.status(403).json({ error: 'Unauthorized' })
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken
      return db
        .collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get()
    })
    .then(data => {
      req.user.handle = data.docs[0].data().handle
      return next()
    })
    .catch(err => {
      console.error('Error while verifying token,', err)
      return res.status(403).json(err)
    })
}

module.exports = {
  FBAuth
}
