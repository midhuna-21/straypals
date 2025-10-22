
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import Header from '../components/Header'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { initReferralCapture } from '../lib/referrals'
import { listenForegroundNotifications } from '../lib/notifications'
import { auth } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Sentry (client + server)
import '../lib/sentry.server'
import Sentry from '../lib/sentry.client'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    initReferralCapture(router)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(() => { })
    }
    listenForegroundNotifications((t, b) => {
      try { new Notification(t, { body: b }) } catch { }
    })
    const unsub = onAuthStateChanged(auth, u => {
      if (u) Sentry.setUser({ id: u.uid, email: u.email || undefined })
      else Sentry.setUser(null as any)
    })
    return () => unsub()
  }, [router])
  return (<>
    <Header />
    <div className="container"><Component {...pageProps} /></div>
    <div className="footer"><div className="container">© StrayPals v15.4</div></div>
  </>)
}
