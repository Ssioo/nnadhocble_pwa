/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * webcross_ar_app from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 19. 오후 4:50
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

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
      </Route> : <Redirect to='/' />)
  }
}
