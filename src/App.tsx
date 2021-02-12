import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { AuthRoute } from './views/components/auth-router'

const Home = lazy(() => import('./views/home'))

function App() {
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
