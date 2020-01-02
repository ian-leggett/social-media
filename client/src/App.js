import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

// Redux
import { Provider } from 'react-redux'
import store from './redux/store'

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

// Styles
import './App.css'

// Theme
import muiTheme from './util/theme'

let theme = createMuiTheme(muiTheme)

let authenticated
const token = localStorage.FBIdToken

if (token) {
  const decodedToken = jwtDecode(token)
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = '/login'
    authenticated = false
  } else {
    authenticated = true
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
                authenticated={authenticated}
              />
              <Authroute
                exact
                path='/signup'
                component={signup}
                authenticated={authenticated}
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
