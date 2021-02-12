import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorkerRegistration from './infra/service-worker-registration'
import { initFirebase } from './infra/firebase-init'

// Initialize Firebase
initFirebase()

ReactDOM.render(<App/>, document.getElementById('root'))

serviceWorkerRegistration.register()
