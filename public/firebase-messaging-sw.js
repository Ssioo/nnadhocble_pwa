importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-messaging.js')

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCXthCGTDqn-f5Nd0MY5L-Nnxg8g-f6XtQ',
  authDomain: 'mobedchulcheck.firebaseapp.com',
  databaseURL: 'https://mobedchulcheck-default-rtdb.firebaseio.com',
  projectId: 'mobedchulcheck',
  storageBucket: 'mobedchulcheck.appspot.com',
  messagingSenderId: '1078947672432',
  appId: '1:1078947672432:web:b0edff6e66a8c2234adfb5',
  measurementId: 'G-3H44NW5EKZ'
}


// Initialize Firebase
firebase.initializeApp(FIREBASE_CONFIG)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('onBackgroundMessage', payload)
  //self.registration.showNotification(payload.notification.title, { body: payload.notification.body, icon: 'ic_launcher180.png'})
})
