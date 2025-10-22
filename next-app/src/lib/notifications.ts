
import { messagingPromise } from './firebase'
import { getToken, onMessage } from 'firebase/messaging'
import { callFunctionAuthorized } from './cfClient'

export async function enableWebPush(){
  const messaging = await messagingPromise
  if (!messaging) throw new Error('Web push not supported')
  const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
  const vapidKey = process.env.NEXT_PUBLIC_FCM_VAPID_KEY || ''
  const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: reg })
  if (!token) throw new Error('No FCM token')
  await callFunctionAuthorized('registerFcmToken', { fcmToken: token })
  return token
}

export function listenForegroundNotifications(onMsg: (title:string, body:string)=>void){
  messagingPromise.then(m => {
    if (!m) return
    onMessage(m, payload => {
      const t = payload.notification?.title || 'StrayPals'
      const b = payload.notification?.body || ''
      onMsg(t,b)
    })
  })
}
