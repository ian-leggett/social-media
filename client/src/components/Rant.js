import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom'
import moment from 'moment'

// Mui stuff
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import { Typography } from '@material-ui/core'

const styles = {
  card: {
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
    } = this.props
    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title='Profile image'
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            color='primary'
            variant='h5'
            component={Link}
            to={`/users/${userHandle}`}
          >
            {userHandle}
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            {moment(createdAt).fromNow()}
          </Typography>
          <Typography variant='body1'>{body}</Typography>
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(styles)(Rant)
