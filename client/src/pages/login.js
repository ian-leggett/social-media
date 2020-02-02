import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// Redux
import { connect } from 'react-redux'
import { loginUser } from '../redux/actions/userActions'

// Images
import AppIcon from '../../src/images/mankey.png'

// Mui stuff
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  form: {
    textAlign: 'center',
  },
  pageTitle: {
    margin: `${theme.spacing(1)}px auto ${theme.spacing(1)}px auto`,
  },
  image: {
    width: '48px',
    transition: 'all .1s ease-in-out',
    margin: `${theme.spacing(1)}px auto ${theme.spacing(1)}px auto`,
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  textField: {
    margin: `${theme.spacing(1)}px auto ${theme.spacing(1)}px auto`,
  },
  button: {
    position: 'relative',
    margin: '20px 0 20px',
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: '10px',
  },
  progress: {
    position: 'absolute',
  },
})

export class login extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      errors: {},
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ui.errors) {
      this.setState({ errors: nextProps.ui.errors })
    }
  }

  handleSubmit = event => {
    event.preventDefault()
    const userData = {
      email: this.state.email,
      password: this.state.password,
    }
    this.props.loginUser(userData, this.props.history)
  }
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  render() {
    const {
      classes,
      ui: { loading },
    } = this.props
    const { errors } = this.state
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img
            src={AppIcon}
            alt='Angry Mankey'
            className={classes.image}
            title='Login and get ranting!'
          />
          <Typography
            variant='h1'
            className={classes.pageTitle}
            color='textPrimary'
          >
            Login
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id='email'
              name='email'
              label='Email'
              className={classes.textField}
              value={this.state.email}
              onChange={this.handleChange}
              helperText={errors.email}
              error={errors.email ? true : false}
              fullWidth
            />
            <TextField
              id='password'
              name='password'
              label='Password'
              className={classes.textField}
              value={this.state.password}
              onChange={this.handleChange}
              helperText={errors.password}
              error={errors.password ? true : false}
              fullWidth
            />
            {errors.general && (
              <Typography variant='body2' className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type='submit'
              variant='contained'
              color='primary'
              className={classes.button}
              disabled={loading}
            >
              Login
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            <div>
              <small>
                Dont have an account? sign up <Link to='/signup'>here</Link>
              </small>
            </div>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    )
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
}
const mapStateToProps = state => ({
  user: state.user,
  ui: state.ui,
})

const mapActionsToProps = {
  loginUser,
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(login))
