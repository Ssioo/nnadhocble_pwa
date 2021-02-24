/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * webcross_ar_app from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 22. 오후 3:34
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
