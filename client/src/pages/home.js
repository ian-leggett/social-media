import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'

// Components
import Rant from '../components/Rant'
import Profile from '../components/Profile'

export class home extends Component {
  state = {
    rants: null,
  }

  componentDidMount() {
    axios
      .get('/rants')
      .then(res => {
        this.setState({
          rants: res.data,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    let recentRants = this.state.rants ? (
      this.state.rants.map(rant => <Rant key={rant.rantId} rant={rant} />)
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

export default home
