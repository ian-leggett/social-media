import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const Authroute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authenticated === true ? <Redirect to='/' /> : <Component {...props} />
    }
  />
)

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
})

Authroute.propTypes = {
  user: PropTypes.object,
}

export default connect(mapStateToProps)(Authroute)
