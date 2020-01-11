import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import PropTypes from 'prop-types'

// Components
import Rant from '../components/Rant'
import Profile from '../components/Profile'

import { connect } from 'react-redux'
import { getRants } from '../redux/actions/dataActions'

export class home extends Component {
  state = {
    rants: null,
  }

  componentDidMount() {
    this.props.getRants()
  }

  render() {
    const { rants, loading } = this.props.data
    let recentRants = !loading ? (
      rants.map(rant => <Rant key={rant.rantId} rant={rant} />)
    ) : (
      <p>Loading...</p>
    )
    return (
      <Grid container spacing={4}>
        <Grid item sm={8} xs={12}>
          {recentRants}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    )
  }
}

home.propTypes = {
  getRants: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  data: state.data,
})

export default connect(mapStateToProps, { getRants })(home)
