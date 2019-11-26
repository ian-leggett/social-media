const app = require('express')()
const { getRants, createRant, getRant } = require('./handlers/rants')
const {
  signUp,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require('./handlers/users')
const { FBAuth } = require('./middleware')

app.get('/rants', getRants)
app.post('/rant', FBAuth, createRant)
app.get('/rant/:rantId', getRant)
// TODO: delete rant
// TODO: like a rant
// TODO: unlike a rant
// TODO: comment on a rant

app.post('/signup', signUp)
app.post('/login', login)
app.post('/user', FBAuth, addUserDetails)
app.post('/user/image', FBAuth, uploadImage)
app.get('/user', FBAuth, getAuthenticatedUser)

module.exports = app
