import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'

import AppIcon from '../../src/images/mankey.png'

// Mui stuff
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const styles = {
  form: {
    textAlign: 'center',
  },
  image: {
    margin: '10px auto 10px auto',
  },
}

export class login extends Component {
  render() {
    const { classes } = this.props
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt='Angrey Mankey' className={classes.image} />
          <Typography variant='h1' className={classes.pageTitle}>
            Login
          </Typography>
        </Grid>
        <Grid item sm />
      </Grid>
    )
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(login)
