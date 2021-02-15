importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-messaging.js')

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBRTE_u7pNFTRPWD4CKOlH_OFhpnaKsEcQ',
  authDomain: 'nnadhocble.firebaseapp.com',
  databaseURL: 'https://nnadhocble-default-rtdb.firebaseio.com',
  projectId: 'nnadhocble',
  storageBucket: 'nnadhocble.appspot.com',
  messagingSenderId: '597038536501',
  appId: '1:597038536501:web:d326b5b69b917d581c5e7c',
  measurementId: 'G-BLDSVPDMH5'
}


// Initialize Firebase
firebase.initializeApp(FIREBASE_CONFIG)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('onBackgroundMessage', payload)
  //self.registration.showNotification(payload.notification.title, { body: payload.notification.body, icon: 'ic_launcher180.png'})
})
