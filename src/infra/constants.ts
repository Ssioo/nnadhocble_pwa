export const isDev = process.env.NODE_ENV !== 'production'

export const BASE_URL = isDev ? 'http://localhost:5000' : 'https://cumulus.hoons.io:5000'

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCXthCGTDqn-f5Nd0MY5L-Nnxg8g-f6XtQ',
  authDomain: 'mobedchulcheck.firebaseapp.com',
  databaseURL: 'https://mobedchulcheck-default-rtdb.firebaseio.com',
  projectId: 'mobedchulcheck',
  storageBucket: 'mobedchulcheck.appspot.com',
  messagingSenderId: '1078947672432',
  appId: '1:1078947672432:web:b0edff6e66a8c2234adfb5',
  measurementId: 'G-3H44NW5EKZ'
}

export const FCM_KEY = 'BFuII-gSgT5PGZwFUktwc49VCUmQURyMGexOTzkOcdS3_rNPDgZ9PJIvvs-1FMCBfIx65CevzmZ2O1mduWlugYM'
