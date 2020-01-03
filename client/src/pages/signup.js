import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

//  Redux stuff
import { connect } from 'react-redux'
import { signupUser } from '../redux/actions/userActions'

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

export class signup extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      handle: '',
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
    this.setState({
      loading: true,
    })
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      handle: this.state.handle,
    }
    this.props.signupUser(newUserData, this.props.history)
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
            alt='Angrey Mankey'
            className={classes.image}
            title='Login and get ranting!'
          />
          <Typography
            variant='h1'
            className={classes.pageTitle}
            color='textPrimary'
          >
            Sign up
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
            <TextField
              id='confirmPassword'
              name='confirmPassword'
              label='Confirm password'
              className={classes.textField}
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              fullWidth
            />
            <TextField
              id='handle'
              name='handle'
              label='Handle'
              type='text'
              className={classes.textField}
              value={this.state.handle}
              onChange={this.handleChange}
              helperText={errors.handle}
              error={errors.handle ? true : false}
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
              Signup
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            <div>
              <small>
                Already have an account? login <Link to='/signup'>here</Link>
              </small>
            </div>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    )
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  user: state.user,
  ui: state.ui,
})

const mapActionsToProps = {
  signupUser,
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(signup))
