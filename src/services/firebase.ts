import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getMessaging, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyAbSOdstuMQEySmRtb_9SMKqxJHmhbk0oE",
  authDomain: "finance-pod-kontrolou.firebaseapp.com",
  projectId: "finance-pod-kontrolou",
  storageBucket: "finance-pod-kontrolou.firebasestorage.app",
  messagingSenderId: "839958398366",
  appId: "1:839958398366:web:2df718aabf2d8c9e7a028f",
  measurementId: "G-N1WVX44NPN"
}

// Inicializace Firebase
const app = initializeApp(firebaseConfig)

// Analytics (přidán export, aby TypeScript nehlásil nepoužitou proměnnou)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Firebase Messaging pro notifikace
export let messaging: ReturnType<typeof getMessaging> | null = null

try {
  messaging = getMessaging(app)
  
  // Naslouchání push notifikacím na popředí
  onMessage(messaging, (payload) => {
    console.log('Message received: ', payload)
    if ('Notification' in window) {
      new Notification(payload.notification?.title || 'Finance pod kontrolou', {
        body: payload.notification?.body || 'Nová zpráva',
        icon: '/pwa-192x192.png',
      })
    }
  })
} catch (error) {
  console.log('Messaging not available:', error)
}

export default app
