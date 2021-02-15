import firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/messaging'
import { FCM_KEY, FIREBASE_CONFIG } from './constants'

export const initFirebase = () => {
  firebase.initializeApp(FIREBASE_CONFIG)
  firebase.analytics()

  const messaging = firebase.messaging()
  messaging.getToken({ vapidKey: FCM_KEY }).then((t) => localStorage.setItem('fcm_token', t))
  messaging.onMessage((payload) => {
    console.log('onMessage', payload)
    const notification = new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: payload.notification.icon,
      badge: payload.notification.icon,
      vibrate: payload.notification.vibrate ?? payload.notification.vibrateTimingsMillis,
    })
    notification.onclick = (event) => {
      notification.close()
      window.open('https://nnadhoc-ble.netlify.app/')
    }
  })

}
