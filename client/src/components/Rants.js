import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'

// Mui stuff
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import { Typography } from '@material-ui/core'

const styles = {
  card: {
    display: 'flex',
  },
}

export class Rants extends Component {
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
      <Card>
        <CardMedia image={userImage} title='Profile image' />
        <CardContent>
          <Typography variant='h5'>{userHandle}</Typography>
          <Typography variant='body2' color='textSecondary'>
            {createdAt}
          </Typography>
          <Typography variant='body1'>{body}</Typography>
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(styles)(Rants)
