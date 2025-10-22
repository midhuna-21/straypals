
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as https from 'https'
import * as http from 'http'
import sharp from 'sharp'
import * as Sentry from '@sentry/node'

if (!admin.apps.length) admin.initializeApp()
const db = admin.firestore()

Sentry.init({
  dsn: process.env.SENTRY_DSN || (functions.config().sentry?.dsn),
  environment: process.env.NODE_ENV || 'production',
  release: process.env.GIT_COMMIT_SHA || process.env.K_REVISION || undefined,
})

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const OG_PATH = (kind:string, id:string)=> `public/og/${kind}/${id}.png`

function fetchBufferWithLimit(url: string, limit=MAX_IMAGE_BYTES): Promise<Buffer>{
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const mod = u.protocol === 'https:' ? https : http
    const req = mod.get(u, (res) => {
      if (res.statusCode && res.statusCode >= 400) { res.resume(); return reject(new Error('HTTP '+res.statusCode)) }
      const len = Number(res.headers['content-length'] || 0)
      if (len && len > limit) { res.destroy(); return reject(new Error('image too large')) }
      const chunks: Buffer[] = []
      let size = 0
      res.on('data', (d)=> { 
        size += (d as Buffer).length
        if (size > limit) { res.destroy(); reject(new Error('image too large')); return }
        chunks.push(d as Buffer) 
      })
      res.on('end', ()=> resolve(Buffer.concat(chunks)))
    })
    req.on('error', reject)
  })
}
async function readStorageOg(kind:string, id:string): Promise<Buffer|null>{
  try{
    const file = admin.storage().bucket().file(OG_PATH(kind,id))
    const [exists] = await file.exists()
    if (!exists) return null
    const [buf] = await file.download()
    return buf
  }catch{ return null }
}
async function writeStorageOg(kind:string, id:string, png: Buffer){
  try{
    const file = admin.storage().bucket().file(OG_PATH(kind,id))
    await file.save(png, { contentType:'image/png', public: true, metadata: { cacheControl: 'public, max-age=31536000' } })
  }catch{}
}
function esc(s:string){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

async function findPhotoBuffer(kind: string, id: string): Promise<Buffer|null>{
  try{
    if (kind==='dog'){
      const d = await db.collection('dogReports').doc(id).get()
      const x:any = d.exists? d.data(): null
      const url = Array.isArray(x?.photos) && x.photos[0] ? x.photos[0] : (x?.photo || '')
      if (url && /^https?:\/\//i.test(url)) return await fetchBufferWithLimit(url)
    }
    if (kind==='station'){
      const s = await db.collection('stations').doc(id).get()
      const x:any = s.exists? s.data(): null
      const url = x?.coverUrl || x?.photo || ''
      if (url && /^https?:\/\//i.test(url)) return await fetchBufferWithLimit(url)
    }
  }catch{}
  return null
}

// export const ogImage = functions.region('us-central1').https.onRequest(async (req, res) => {
//   try{
//     const kind = String(req.query.kind||'')
//     const id = String(req.query.id||'')
//     const refresh = String(req.query.refresh||'') === '1'
//     const titleQ = String(req.query.title||'')
//     let title = titleQ || ''
//     const W=1200, H=630
//     if (!refresh){
//       const cached = await readStorageOg(kind, id)
//       if (cached){
//         res.set('Content-Type','image/png')
//         res.set('Cache-Control','public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400')
//         res.set('Access-Control-Allow-Origin','*')
//         // return res.status(200).send(cached)
//         res.status(200).send(cached)
// return

//       }
//     }
//     const photo = await findPhotoBuffer(kind, id)
//     let out: Buffer
//     if (!photo){
//       const svg = `
//         <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
//           <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0e1723"/><stop offset="100%" stop-color="#0b1117"/></linearGradient></defs>
//           <rect width="100%" height="100%" fill="url(#bg)"/>
//           <rect x="40" y="40" rx="20" ry="20" width="${W-80}" height="${H-80}" fill="#0f1720" stroke="#1e293b"/>
//           <text x="80" y="130" font-family="Inter,Segoe UI,Arial" font-weight="700" font-size="60" fill="#e5edf5">StrayPals</text>
//           <text x="80" y="220" font-family="Inter,Segoe UI,Arial" font-weight="600" font-size="48" fill="#a5dbff">${esc(title || (kind==='station'?'Station':'Community dog'))}</text>
//           <text x="80" y="${H-120}" font-family="Inter,Segoe UI,Arial" font-size="28" fill="#9fb3c8">${esc(kind==='station'?'Feeding Station':'Community Dog')}</text>
//         </svg>`
//       out = await sharp(Buffer.from(svg)).png().toBuffer()
//     } else {
//       const bg = await sharp(photo).resize(W, H, { fit:'cover' }).modulate({ brightness:0.8, saturation:0.95 }).blur(12).toBuffer()
//       const overlaySvg = Buffer.from(`
//         <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
//           <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.35)" />
//           <rect x="40" y="40" rx="20" ry="20" width="${W-80}" height="${H-80}" fill="rgba(15,23,32,0.68)" stroke="#1e293b"/>
//           <text x="80" y="130" font-family="Inter,Segoe UI,Arial" font-weight="700" font-size="60" fill="#e5edf5">StrayPals</text>
//           <text x="80" y="220" font-family="Inter,Segoe UI,Arial" font-weight="600" font-size="48" fill="#a5dbff">${esc(title || '')}</text>
//           <text x="80" y="${H-120}" font-family="Inter,Segoe UI,Arial" font-size="28" fill="#9fb3c8">${esc(kind==='station'?'Feeding Station':'Community Dog')}</text>
//         </svg>
//       `)
//       out = await sharp(bg).composite([{ input: overlaySvg, top: 0, left: 0 }]).png().toBuffer()
//     }
//     try{ await writeStorageOg(kind, id, out) }catch{}
//     res.set('Content-Type','image/png')
//     res.set('Cache-Control','public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400')
//     res.set('Access-Control-Allow-Origin','*')
//     return res.status(200).send(out)
//   }catch(e:any){
//     Sentry.captureException(e)
//     return res.status(500).send('error')
//   }
// })

export const ogImage = functions.region('us-central1').https.onRequest(async (req, res) => {
  try {
    const kind = String(req.query.kind || '')
    const id = String(req.query.id || '')
    const refresh = String(req.query.refresh || '') === '1'
    const titleQ = String(req.query.title || '')
    const title = titleQ || ''
    const W = 1200, H = 630

    if (!refresh) {
      const cached = await readStorageOg(kind, id)
      if (cached) {
        res.set('Content-Type', 'image/png')
        res.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400')
        res.set('Access-Control-Allow-Origin', '*')
        res.status(200).send(cached)
        return
      }
    }

    const photo = await findPhotoBuffer(kind, id)
    let out: Buffer

    if (!photo) {
      const svg = `
        <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0e1723"/>
              <stop offset="100%" stop-color="#0b1117"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg)"/>
          <rect x="40" y="40" rx="20" ry="20" width="${W-80}" height="${H-80}" fill="#0f1720" stroke="#1e293b"/>
          <text x="80" y="130" font-family="Inter,Segoe UI,Arial" font-weight="700" font-size="60" fill="#e5edf5">StrayPals</text>
          <text x="80" y="220" font-family="Inter,Segoe UI,Arial" font-weight="600" font-size="48" fill="#a5dbff">${esc(title || (kind==='station'?'Station':'Community dog'))}</text>
          <text x="80" y="${H-120}" font-family="Inter,Segoe UI,Arial" font-size="28" fill="#9fb3c8">${esc(kind==='station'?'Feeding Station':'Community Dog')}</text>
        </svg>`
      out = await sharp(Buffer.from(svg)).png().toBuffer()
    } else {
      const bg = await sharp(photo)
        .resize(W, H, { fit: 'cover' })
        .modulate({ brightness: 0.8, saturation: 0.95 })
        .blur(12)
        .toBuffer()

      const overlaySvg = Buffer.from(`
        <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.35)" />
          <rect x="40" y="40" rx="20" ry="20" width="${W-80}" height="${H-80}" fill="rgba(15,23,32,0.68)" stroke="#1e293b"/>
          <text x="80" y="130" font-family="Inter,Segoe UI,Arial" font-weight="700" font-size="60" fill="#e5edf5">StrayPals</text>
          <text x="80" y="220" font-family="Inter,Segoe UI,Arial" font-weight="600" font-size="48" fill="#a5dbff">${esc(title || '')}</text>
          <text x="80" y="${H-120}" font-family="Inter,Segoe UI,Arial" font-size="28" fill="#9fb3c8">${esc(kind==='station'?'Feeding Station':'Community Dog')}</text>
        </svg>
      `)

      out = await sharp(bg).composite([{ input: overlaySvg, top: 0, left: 0 }]).png().toBuffer()
    }

    try { await writeStorageOg(kind, id, out) } catch {}

    res.set('Content-Type', 'image/png')
    res.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400')
    res.set('Access-Control-Allow-Origin', '*')
    res.status(200).send(out)
  } catch (e: any) {
    Sentry.captureException(e)
    res.status(500).send('error')
  }
})

export const reportCsp = functions.region('us-central1').https.onRequest(async (req, res) => {
  try{
    if (req.method !== 'POST'){
      
       res.status(405).send('Method Not Allowed')
       return
    } 
    const raw = (req as any).rawBody ? (req as any).rawBody.toString() : JSON.stringify(req.body||{})
    let payload: any = {}
    try { payload = JSON.parse(raw) } catch {}
    const report = payload['csp-report'] || (Array.isArray(payload) ? payload[0] : payload) || payload
    const item = {
      at: admin.firestore.FieldValue.serverTimestamp(),
      ua: req.headers['user-agent'] || '',
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
      referrer: req.headers['referer'] || '',
      report
    }
    await db.collection('cspReports').add(item)
    res.status(204).end()
  }catch(e:any){
    Sentry.captureException(e)
    res.status(204).end()
  }
})
