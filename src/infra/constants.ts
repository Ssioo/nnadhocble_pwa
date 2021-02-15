export const isDev = process.env.NODE_ENV !== 'production'

export const BASE_URL = isDev ? 'http://localhost:5000' : 'https://cumulus.hoons.io:5000'

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBRTE_u7pNFTRPWD4CKOlH_OFhpnaKsEcQ',
  authDomain: 'nnadhocble.firebaseapp.com',
  databaseURL: 'https://nnadhocble-default-rtdb.firebaseio.com',
  projectId: 'nnadhocble',
  storageBucket: 'nnadhocble.appspot.com',
  messagingSenderId: '597038536501',
  appId: '1:597038536501:web:d326b5b69b917d581c5e7c',
  measurementId: 'G-BLDSVPDMH5'
}

export const FCM_KEY = 'AAAAiwJFFzU:APA91bH1SCwmTHB75xjpQU1qW3VivVg_4xNKoL_srcWrEN1k3FNCtgejXCM53Y5Y-PaF6ZCjCUfR46b8QFX_i0s6iBvwNCiVAZE8hWzz2YMXZovgYCHUlAQKGmQh0RAhpiU4WcpC8nL4'
