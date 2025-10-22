
import * as Sentry from '@sentry/nextjs'
const release = process.env.NEXT_PUBLIC_APP_VERSION || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'dev'
const environment = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV
if (!Sentry.getCurrentHub().getClient()){
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    release,
    environment,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}
export default Sentry
