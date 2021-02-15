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

export const FCM_KEY = 'BPowusk4igXsw2fQBJ856ZJUSAkTAE81LRe84c7_6ZWD2nP0WDew1BhBShVlXg856bgTD-YkmHEGP_i_GoZnwaA'
