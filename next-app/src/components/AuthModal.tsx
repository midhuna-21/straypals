
import { useState } from 'react'
import { auth } from '../lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'

type Props = { open: boolean, onClose: ()=>void }

export default function AuthModal({ open, onClose }: Props){
  const [mode, setMode] = useState<'signin'|'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  if (!open) return null

  async function submit(e:any){
    e.preventDefault()
    setErr(''); setBusy(true)
    try{
      if (mode==='signup'){
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (name) await updateProfile(cred.user, { displayName: name })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      onClose()
    }catch(e:any){
      setErr(e?.message || 'Authentication failed')
    }finally{
      setBusy(false)
    }
  }

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50}} onClick={onClose}>
      <div className="card" style={{width:380}} onClick={e=>e.stopPropagation()}>
        <h3 style={{marginTop:0}}>{mode==='signup'? 'Create account' : 'Sign in with Email'}</h3>
        <form onSubmit={submit}>
          {mode==='signup' && <input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} style={{marginBottom:8}} />}
          <input type="email" placeholder="email@example.com" value={email} onChange={e=>setEmail(e.target.value)} style={{marginBottom:8}} required />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{marginBottom:8}} required />
          {err && <div style={{color:'#f87171', marginBottom:8}}>{err}</div>}
          <div style={{display:'flex', gap:8}}>
            <button className="cta primary" type="submit" disabled={busy}>{busy? 'Please wait…' : (mode==='signup'?'Create account':'Sign in')}</button>
            <button className="cta ghost" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
        <div style={{marginTop:10, fontSize:13, color:'#9fb3c8'}}>
          {mode==='signup'? 'Already have an account?' : 'New here?'}{' '}
          <a className="link" onClick={()=>setMode(mode==='signup'?'signin':'signup')} style={{cursor:'pointer'}}>{mode==='signup'?'Sign in':'Create one'}</a>
        </div>
      </div>
    </div>
  )
}
