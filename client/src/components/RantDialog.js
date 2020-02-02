import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import moment from 'moment'
import MyButton from '../util/MyButton'
import LikeButton from './LikeButton'
import Comments from './Comments'
import CommentForm from './CommentForm'

import { Link } from 'react-router-dom'
// MUI Stuff
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
// Icons
import CloseIcon from '@material-ui/icons/Close'
import UnfoldMore from '@material-ui/icons/UnfoldMore'
import ChatIcon from '@material-ui/icons/Chat'
// Redux stuff
import { connect } from 'react-redux'
import { getRant, clearErrors } from '../redux/actions/dataActions'

const styles = () => ({
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  dialogContent: {
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    left: '90%',
  },
  expandButton: {
    position: 'absolute',
    left: '90%',
  },
  spinnerDiv: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
})

class RantDialog extends Component {
  state = {
    open: false,
    oldPath: '',
    newPath: '',
  }
  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen()
    }
  }
  handleOpen = () => {
    let oldPath = window.location.pathname

    const { userHandle, rantId } = this.props
    const newPath = `/users/${userHandle}/Rant/${rantId}`

    if (oldPath === newPath) oldPath = `/users/${userHandle}`

    window.history.pushState(null, null, newPath)

    this.setState({ open: true, oldPath, newPath })
    this.props.getRant(this.props.rantId)
  }
  handleClose = () => {
    window.history.pushState(null, null, this.state.oldPath)
    this.setState({ open: false })
    this.props.clearErrors()
  }

  render() {
    const {
      classes,
      rant: {
        rantId,
        body,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        userHandle,
        comments,
      },
      ui: { loading },
    } = this.props

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={2}>
        <Grid item sm={5}>
          <img src={userImage} alt='Profile' className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography
            component={Link}
            color='primary'
            variant='h5'
            to={`/users/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant='body2' color='textSecondary'>
            {moment(createdAt).format('h:mm a, MMMM DD YYYY')}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant='body1'>{body}</Typography>
          <LikeButton rantId={rantId} />
          <span>{likeCount} likes</span>
          <MyButton tip='comments'>
            <ChatIcon color='primary' />
          </MyButton>
          <span>{commentCount} comments</span>
        </Grid>
        <hr className={classes.visibleSeparator} />
        <CommentForm rantId={rantId} />
        <Comments comments={comments} />
      </Grid>
    )
    return (
      <Fragment>
        <MyButton
          onClick={this.handleOpen}
          tip='Expand Rant'
          tipClassName={classes.expandButton}
        >
          <UnfoldMore color='primary' />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth='sm'
        >
          <MyButton
            tip='Close'
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    )
  }
}

RantDialog.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  getRant: PropTypes.func.isRequired,
  rantId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  rant: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  rant: state.data.rant,
  ui: state.ui,
})

const mapActionsToProps = {
  getRant,
  clearErrors,
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(RantDialog))
