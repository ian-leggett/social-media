import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import axios from 'axios'

// Redux
import { Provider } from 'react-redux'
import store from './redux/store'
import { SET_AUTHENTICATED } from './redux/types'
import { logoutUser, getUserData } from './redux/actions/userActions'

// Mui stuff
import { MuiThemeProvider } from '@material-ui/core/styles'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

// Components
import NavBar from './components/NavBar'
import Authroute from './util/Authroute'

// Pages
import home from './pages/home'
import login from './pages/login'
import signup from './pages/signup'
import user from './pages/user'

// Styles
import './App.css'

// Theme
import muiTheme from './util/theme'

let theme = createMuiTheme(muiTheme)

axios.defaults.baseURL = 'https://europe-west1-social-media-ad3fc.cloudfunctions.net/api'

const token = localStorage.FBIdToken

if (token) {
  const decodedToken = jwtDecode(token)
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser())
    window.location.href = '/login'
  } else {
    store.dispatch({type: SET_AUTHENTICATED})
    axios.defaults.headers.common['Authorization'] = token
    store.dispatch(getUserData())
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <NavBar />
          <Grid className='container'>
            <Switch>
              <Route exact path='/' component={home} />
              <Authroute
                exact
                path='/login'
                component={login}

              />
              <Authroute
                exact
                path='/signup'
                component={signup}
              />
              <Route exact path='/users/:handle' component={user} />
              <Route
                  exact
                  path="/users/:handle/rant/:rantId"
                  component={user}
                />
            </Switch>
          </Grid>
          <Typography
            component={Link}
            href='https://icons8.com/'
            color='secondary'
          >
            Icons by Icons 8
          </Typography>
        </Router>
      </Provider>
    </MuiThemeProvider>
  )
}

export default App
