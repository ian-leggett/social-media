import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Rant from '../components/Rant';
import StaticProfile from '../components/StaticProfile';
import Grid from '@material-ui/core/Grid';

import RantSkeleton from '../util/RantSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class user extends Component {
  state = {
    profile: null,
    rantIdParam: null
  };
  componentDidMount() {
    const handle = this.props.match.params.handle;
    const rantId = this.props.match.params.rantId;

    if (rantId) this.setState({ rantIdParam: rantId });

    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({
          profile: res.data.user
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { rants, loading } = this.props.data;
    const { rantIdParam } = this.state;

    const rantsMarkup = loading ? (
      <RantSkeleton />
    ) : rants === null ? (
      <p>No rants from this user</p>
    ) : !rantIdParam ? (
      rants.map((rant) => <Rant key={rant.rantId} rant={rant} />)
    ) : (
      rants.map((rant) => {
        if (rant.rantId !== rantIdParam)
          return <Rant key={rant.rantId} rant={rant} />;
        else return <Rant key={rant.rantId} rant={rant} openDialog />;
      })
    );

    return (
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {rantsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { getUserData }
)(user);