
// Fill your Firebase config below (same as .env.local)
self.__FIREBASE_CONFIG = {
  apiKey: "<API_KEY>",
  authDomain: "<AUTH_DOMAIN>",
  projectId: "<PROJECT_ID>",
  storageBucket: "<STORAGE_BUCKET>",
  messagingSenderId: "<SENDER_ID>",
  appId: "<APP_ID>"
};

importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js')
firebase.initializeApp(self.__FIREBASE_CONFIG)
const messaging = firebase.messaging()
messaging.onBackgroundMessage(function(payload) {
  const title = payload?.notification?.title || 'StrayPals'
  const options = { body: payload?.notification?.body || '', icon: '/icons/icon-192.png' }
  self.registration.showNotification(title, options)
})
