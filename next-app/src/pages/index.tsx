
import Link from 'next/link'
import { enableWebPush } from '../lib/notifications'
export default function Home() {
  return (
    <main style={{ padding: '24px', maxWidth: 1080, margin: '0 auto' }}>
      <section style={{ background: 'linear-gradient(180deg, #0e1723 0%, #0b1117 100%)', border: '1px solid #1e293b', borderRadius: 16, padding: '28px 20px', marginBottom: 16 }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: 32, lineHeight: 1.2 }}>Because every stray deserves a friend</h1>
        <p style={{ margin: '0 0 16px 0', color: '#9fb3c8', maxWidth: 780 }}>Join thousands of animal lovers making a difference — one bowl at a time. Report local strays, find feeding stations, and coordinate care with your community.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/report" className="cta primary">🐾 Report a Stray</Link>
          <Link href="/map" className="cta">🗺️ Find Stations Near You</Link>
          <Link href="/me" className="cta ghost">👤 My Profile</Link>
          <button className="cta" onClick={() => enableWebPush().then(() => alert('Notifications enabled')).catch(e => alert(e.message))}>🔔 Enable notifications</button>
        </div>
      </section>
      <section className="card"><h2>How StrayPals works</h2>
        <div className="grid3">
          <div className="tile"><h3>Spot a stray</h3><p>Take a picture or note the location. Use <Link href="/report">Report</Link> to upload and name them.</p></div>
          <div className="tile"><h3>Mark the location</h3><p>Use your phone’s GPS or drop a pin to mark where they were last seen.</p></div>
          <div className="tile"><h3>We coordinate care</h3><p>Volunteers & NGOs handle feeding, vaccinations, and medical care.</p></div>
        </div>
      </section>
    </main>
  )
}
