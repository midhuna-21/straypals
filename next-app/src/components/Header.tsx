
import Link from 'next/link'
import dynamic from 'next/dynamic'
const LoginWidget = dynamic(()=> import('./LoginWidget'), { ssr: false })
export default function Header(){
  return (
    <header>
      <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <div className="brand">StrayPals</div>
        <nav style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}}>
          <Link href="/">Home</Link>
          <Link href="/report">Report</Link>
          <Link href="/map">Map</Link>
          <Link href="/tasks">Tasks</Link>
          <Link href="/sos">SOS</Link>
          <Link href="/posters">Posters</Link>
          <Link href="/campaign/pass-the-bowl">Pass the Bowl</Link>
          <Link href="/me">Me</Link>
          <span style={{width:1,height:16,background:'#1e293b',display:'inline-block',margin:'0 6px'}} />
          <Link href="/admin/stations">Stations</Link>
          <Link href="/admin/moderation-covers">Moderation</Link>
          <Link href="/admin/stations-dashboard">Dashboard</Link>
          <Link href="/admin/referrals-analytics">Referrals</Link>
          <Link href="/admin/cms-copy">CMS</Link>
          <span style={{flex:1}} />
          <LoginWidget/>
        </nav>
      </div>
    </header>
  )
}
