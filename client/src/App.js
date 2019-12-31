import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// Mui stuff
import { MuiThemeProvider } from '@material-ui/core/styles'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import Link from '@material-ui/core/Link'

// Components
import NavBar from './components/NavBar'

// Pages
import home from './pages/home'
import login from './pages/login'
import signup from './pages/signup'

// Styles
import './App.css'
import { Typography } from '@material-ui/core'

const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: '3rem',
    },
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#fff',
    },
    secondary: {
      main: '#000',
    },
  },
})

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className='App'>
        <Router>
          <NavBar />
          <div className='container'>
            <Switch>
              <Route exact path='/' component={home} />
              <Route exact path='/login' component={login} />
              <Route exact path='/signup' component={signup} />
            </Switch>
            <Typography
              component={Link}
              href='https://icons8.com/'
              color='secondary'
            >
              Icons by Icons 8
            </Typography>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  )
}

export default App
