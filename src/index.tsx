/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * nnadhocble_pwa from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 17. 오후 4:22
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorkerRegistration from './infra/service-worker-registration'
import { initFirebase } from './infra/firebase-init'

// Initialize Firebase
//initFirebase()

ReactDOM.render(<App/>, document.getElementById('root'))

serviceWorkerRegistration.register()
