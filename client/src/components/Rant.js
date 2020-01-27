import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom'
import moment from 'moment'
import MyButton from '../util/MyButton'
import PropTypes from 'prop-types'
import DeleteRant from './DeleteRant';

import { likeRant, unLikeRant } from '../redux/actions/dataActions'

// Redux
import { connect } from 'react-redux'

// Mui stuff
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import { Typography } from '@material-ui/core'

// Icons
import ChatIcon from '@material-ui/icons/Chat'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'

const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
  },
  content: {
    padding: 25,
    objectFit: 'cover',
  },
}

export class Rant extends Component {
  likedRant = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(like => like.rantId === this.props.rant.rantId)
    ) {
      return true
    } else {
      return false
    }
  }
  likeRant = () => {
    this.props.likeRant(this.props.rant.rantId)
  }
  unLikeRant = () => {
    this.props.unLikeRant(this.props.rant.rantId)
  }
  render() {
    const {
      classes,
      rant: {
        body,
        createdAt,
        userImage,
        userHandle,
        rantId,
        likeCount,
        commentCount,
      },
      user: {
        authenticated,
        credentials: { handle },
      },
    } = this.props

    const likeButton = !authenticated ? (
      <MyButton tip='Like'>
        <Link to='/login'>
          <FavoriteBorder color='primary' />
        </Link>
      </MyButton>
    ) : this.likedRant() ? (
      <MyButton tip='Undo like' onClick={this.unLikeRant}>
        <FavoriteIcon color='primary' />
      </MyButton>
    ) : (
      <MyButton tip='Like' onClick={this.likeRant}>
        <FavoriteBorder color='primary' />
      </MyButton>
    )
    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteRant rantId={rantId} />
      ) : null

    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title='Profile image'
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant='h5'
            component={Link}
            to={`/users/${userHandle}`}
            color='primary'
          >
            {userHandle}
          </Typography>
          {deleteButton}
          <Typography variant='body2' color='textSecondary'>
            {moment(createdAt).fromNow()}
          </Typography>
          <Typography variant='body1'>{body}</Typography>
          {likeButton}
          <span>{likeCount} Likes</span>
          <MyButton tip='comments'>
            <ChatIcon color='primary' />
          </MyButton>
          <span>{commentCount} comments</span>
          {/* <ScreamDialog
            rantId={rantId}
            userHandle={userHandle}
            openDialog={this.props.openDialog}
          /> */}
        </CardContent>
      </Card>
    )
  }
}

Rant.propTypes = {
  likeRant: PropTypes.func.isRequired,
  unLikeRant: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  rant: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
}

const mapStateToProps = state => ({
  user: state.user,
})

export default connect(mapStateToProps, { likeRant, unLikeRant })(
  withStyles(styles)(Rant)
)
