const app = require('express')()
const cors = require('cors')
app.use(cors())
const {
  getRants,
  createRant,
  getRant,
  deleteRant,
  commentOnRant,
  likeRant,
  unLikeRant,
} = require('./handlers/rants')

const {
  signUp,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
} = require('./handlers/users')

const { FBAuth } = require('./middleware')

app.get('/rants', getRants)
app.post('/rant', FBAuth, createRant)
app.get('/rant/:rantId', getRant)
app.delete('/rant/:rantId', FBAuth, deleteRant)
app.get('/rant/:rantId/like', FBAuth, likeRant)
app.get('/rant/:rantId/unlike', FBAuth, unLikeRant)
app.post('/rant/:rantId/comment', FBAuth, commentOnRant)

app.post('/signup', signUp)
app.post('/login', login)
app.post('/user', FBAuth, addUserDetails)
app.post('/user/image', FBAuth, uploadImage)
app.get('/user', FBAuth, getAuthenticatedUser)
app.get('/user/:handle', getUserDetails)
app.post('/notifications', FBAuth, markNotificationsRead)

module.exports = app
