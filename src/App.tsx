/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * nnadhocble_pwa from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 15. 오전 11:24
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

const Home = lazy(() => import('./views/home'))

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Redirect path='*' to='/'/>
        </Switch>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
