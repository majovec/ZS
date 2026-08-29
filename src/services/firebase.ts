import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getMessaging, onMessage } from 'firebase/messaging'

// Tvůj Firebase config - nahraď vlastními hodnotami
const firebaseConfig = {
  apiKey: 'AIzaSyDxxx',
  authDomain: 'finance-pod-kontrolou.firebaseapp.com',
  projectId: 'finance-pod-kontrolou',
  storageBucket: 'finance-pod-kontrolou.appspot.com',
  messagingSenderId: 'xxx',
  appId: '1:xxx:web:xxx',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Messaging pro notifikace
export const messaging = getMessaging(app)

// Naslouchání push notifikacím
onMessage(messaging, (payload) => {
  console.log('Message received: ', payload)
  // Zobrazit notifikaci
  new Notification(payload.notification?.title || 'Finance pod kontrolou', {
    body: payload.notification?.body || 'Nová zpráva',
    icon: '/pwa-192x192.png',
  })
})

export default app
