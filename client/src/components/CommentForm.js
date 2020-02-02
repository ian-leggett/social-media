import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
// MUI Stuff
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
// Redux stuff
import { connect } from 'react-redux'
import { submitComment } from '../redux/actions/dataActions'

class CommentForm extends Component {
  state = {
    body: '',
    errors: {},
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ui.errors) {
      this.setState({ errors: nextProps.ui.errors })
    }
    if (!nextProps.ui.errors && !nextProps.ui.loading) {
      this.setState({ body: '' })
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }
  handleSubmit = event => {
    event.preventDefault()
    this.props.submitComment(this.props.rantId, { body: this.state.body })
  }

  render() {
    const { authenticated } = this.props
    const errors = this.state.errors

    const commentFormMarkup = authenticated ? (
      <Grid item sm={12}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            name='body'
            type='text'
            label='Comment on scream'
            error={errors.comment ? true : false}
            helperText={errors.comment}
            value={this.state.body}
            onChange={this.handleChange}
            fullWidth
          
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
    
          >
            Submit
          </Button>
        </form>
        <hr />
      </Grid>
    ) : null
    return commentFormMarkup
  }
}

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired,
  rantId: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  ui: state.ui,
  authenticated: state.user.authenticated,
})

export default connect(mapStateToProps, { submitComment })(CommentForm)
