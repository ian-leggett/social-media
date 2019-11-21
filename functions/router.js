const app = require('express')()
const { getRants, createRant } = require('./handlers/rants')
const { signUp, login } = require('./handlers/users')
const { FBAuth } = require('./middleware')

app.get('/rants', getRants)
app.post('/rant', FBAuth, createRant)
app.post('/signup', signUp)
app.post('/login', login)

module.exports = app
