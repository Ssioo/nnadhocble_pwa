import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

export interface AuthRouteProps extends RouteProps {
  authenticated: boolean
}

export class AuthRoute extends Route<AuthRouteProps> {

  render() {
    return (
      this.props.authenticated ?
      <Route
        path={this.props.path}
        exact={this.props.exact}
        render={this.props.render}
        component={this.props.component}
        location={this.props.location}
        sensitive={this.props.sensitive}
        strict={this.props.strict}
      >
        {this.props.children}
      </Route> : <Redirect to='/pwa' />)
  }
}
