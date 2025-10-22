
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { auth, db } from '../../lib/firebase'
import { callFunctionAuthorized, functionsBase } from '../../lib/cfClient'
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { maybeRecordReferralConversion } from '../../lib/referrals'

export default function StationPage() {
  const router = useRouter()
  const id = String(router.query.id || '')
  const [uid, setUid] = useState<string | null>(null)
  const [station, setStation] = useState<any>(null)
  const [slots, setSlots] = useState<any[]>([])
  const [bringBuddy, setBringBuddy] = useState(false)
  const [busy, setBusy] = useState<string>('')
  useEffect(() => onAuthStateChanged(auth, u => setUid(u ? u.uid : null)), [])

  useEffect(() => {
    if (!id) return; (async () => {
      const s = await getDoc(doc(db, 'stations', id)); if (s.exists()) setStation({ id: s.id, ...s.data() })
      const qy = query(collection(db, 'schedules'), where('stationId', '==', id), orderBy('startAt', 'asc'))
      const ss = await getDocs(qy); setSlots(ss.docs.map(d => ({ id: d.id, ...d.data() })))
    })()
  }, [id])

  async function volunteer(scheduleId: string) {
    if (!uid) return alert('Please sign in')
    try {
      setBusy(scheduleId)
      await callFunctionAuthorized('assignTaskSlot', { scheduleId })
      await maybeRecordReferralConversion('volunteer')
      if (bringBuddy) { shareBuddy(buddyLink(scheduleId)) } else { alert('Thanks for volunteering! We\'ll remind you.') }
    } catch (e: any) { alert(e?.message || 'Failed to assign slot.') } finally { setBusy('') }
  }
  async function checkIn(scheduleId: string) {
    try {
      setBusy('check:' + scheduleId)
      await callFunctionAuthorized('userCheckIn', { scheduleId })
      await maybeRecordReferralConversion('checkin')
      alert('Checked in! Thanks for being there.')
    } catch (e: any) { alert(e?.message || 'Check‑in failed.') } finally { setBusy('') }
  }
  function buddyLink(scheduleId: string) {
    if (typeof window === 'undefined') return ''
    const base = `${location.protocol}//${location.host}`
    const via = auth.currentUser?.uid || 'guest'
    return `${base}/station/${id}?slot=${encodeURIComponent(scheduleId)}&join=buddy&via=${encodeURIComponent(via)}&campaign=buddy`
  }
  function shareBuddy(link: string) {
    const text = `Join me for a simple 20‑minute task for community dogs → ${link}`
    if (navigator.share) navigator.share({ text, url: link }).catch(() => { })
    else navigator.clipboard.writeText(link).then(() => alert('Buddy link copied!'))
  }

  const og = `${functionsBase()}/ogImage?kind=station&id=${encodeURIComponent(id)}&title=${encodeURIComponent(station?.name || 'Station')}`

  return <main style={{ padding: 24 }}>
    <Head>
      <meta property="og:title" content={station?.name || 'Station'} />
      <meta property="og:image" content={og} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="og:type" content="website" />
    </Head>
    <h1>{station?.name || 'Station'}</h1>
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <input type="checkbox" checked={bringBuddy} onChange={e => setBringBuddy(e.target.checked)} />
      Bring a buddy
    </label>
    <h2>Schedule</h2>
    <table className="table"><thead><tr><th>Role</th><th>Start</th><th>End</th><th>Action</th></tr></thead>
      <tbody>{slots.map(s => {
        const start = s.startAt?.toDate ? s.startAt.toDate().toLocaleString() : String(s.startAt || '')
        const end = s.endAt?.toDate ? s.endAt.toDate().toLocaleString() : String(s.endAt || '')
        const assigned = !!s.assignedTo, mine = s.assignedTo === uid
        return <tr key={s.id}><td>{s.role || ''}</td><td>{start}</td><td>{end}</td>
          <td>
            {!assigned && <button className="cta" disabled={busy === s.id} onClick={() => volunteer(s.id)}>{busy === s.id ? 'Assigning…' : 'Volunteer'}</button>}
            {mine && <button className="cta" disabled={busy === ('check:' + s.id)} onClick={() => checkIn(s.id)}>{busy === ('check:' + s.id) ? 'Checking…' : 'Check in'}</button>}
          </td>
        </tr>
      })}</tbody></table>
  </main>
}
