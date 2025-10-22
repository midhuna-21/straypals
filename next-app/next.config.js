
/** @type {import('next').NextConfig} */
const REGION = process.env.NEXT_PUBLIC_FUNCTIONS_REGION || 'us-central1'
const PROJECT = process.env.NEXT_PUBLIC_FUNCTIONS_PROJECT || 'your-project-id'
const ORIGIN  = (process.env.NEXT_PUBLIC_FUNCTIONS_ORIGIN || `https://${REGION}-${PROJECT}.cloudfunctions.net`).replace(/\/$/, '')
const CSP_REPORT_URI = `${ORIGIN}/reportCsp`

const CSP_DEV = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://*.googleusercontent.com https://firebasestorage.googleapis.com https://storage.googleapis.com",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://www.googleapis.com https://firebasestorage.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://firebaseinstallations.googleapis.com https://fcmregistrations.googleapis.com https://*.cloudfunctions.net ws: wss:",
  "font-src 'self' data:",
  "frame-src https://www.google.com https://www.recaptcha.net",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const CSP_PROD = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://*.googleusercontent.com https://firebasestorage.googleapis.com https://storage.googleapis.com",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://www.googleapis.com https://firebasestorage.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://firebaseinstallations.googleapis.com https://fcmregistrations.googleapis.com https://*.cloudfunctions.net",
  "font-src 'self' data:",
  "frame-src https://www.google.com https://www.recaptcha.net",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const csp = process.env.NODE_ENV === 'production' ? CSP_PROD : CSP_DEV

const nextConfig = {
  reactStrictMode: false,
  async headers() {
    const reportTo = JSON.stringify({
      group: 'csp-endpoint',
      max_age: 10886400,
      endpoints: [{ url: CSP_REPORT_URI }]
    })
    return [{
      source: '/:path*',
      headers: [
        { key: 'Content-Security-Policy-Report-Only', value: `${csp}; report-uri ${CSP_REPORT_URI}; report-to csp-endpoint` },
        { key: 'Report-To', value: reportTo },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: "geolocation=(self), camera=(), microphone=(), clipboard-read=(self), clipboard-write=(self), notifications=(self)" },
        { key: 'X-Frame-Options', value: 'DENY' }
      ]
    }]
  }
}
module.exports = nextConfig
