const firebase = require('firebase')
const functions = require('firebase-functions')

const firebaseConfig = require('./firebase-config')

firebase.initializeApp(firebaseConfig)

exports.api = functions.https.onRequest(require('./router'))
