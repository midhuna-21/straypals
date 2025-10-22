
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { functionsBase } from '../../lib/cfClient'

export default function DogPage(){
  const router = useRouter()
  const id = String(router.query.id || '')
  const [dog, setDog] = useState<any>(null)
  useEffect(()=>{ if(!id) return; (async()=>{ const s=await getDoc(doc(db,'dogReports', id)); if(s.exists()) setDog({ id:s.id, ...s.data() }) })() }, [id])
  const title = dog?.name || 'Community dog'
  const og = `${functionsBase()}/ogImage?kind=dog&id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}`
  return <main style={{padding:24}}>
    <Head>
      <meta property="og:title" content={title} />
      <meta property="og:image" content={og} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="og:type" content="website" />
    </Head>
    <h1>{title}</h1>
    {Array.isArray(dog?.photos) && dog.photos[0] && <img src={dog.photos[0]} alt="" style={{maxWidth:'100%',borderRadius:8}} />}
    <div className="card" style={{marginTop:16}}>
      <div><strong>Status:</strong> {dog?.status || 'pending'}</div>
      <div><strong>Approx location:</strong> {dog?.approxLoc ? `${dog.approxLoc.lat.toFixed(5)}, ${dog.approxLoc.lng.toFixed(5)}` : '—'}</div>
      <div><strong>Notes:</strong> {dog?.note || '—'}</div>
    </div>
  </main>
}
