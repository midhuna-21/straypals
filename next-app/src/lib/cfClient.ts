
import { auth } from './firebase'
function origin(){
  const o = process.env.NEXT_PUBLIC_FUNCTIONS_ORIGIN
  if (o) return o.replace(/\/$/,'')
  const r = process.env.NEXT_PUBLIC_FUNCTIONS_REGION || 'us-central1'
  const p = process.env.NEXT_PUBLIC_FUNCTIONS_PROJECT || ''
  return `https://${r}-${p}.cloudfunctions.net`
}
export function functionsBase(){ return origin() }
export async function callFunctionAuthorized(name: string, body: any){
  const u = auth.currentUser
  const token = u ? await u.getIdToken() : null
  const res = await fetch(`${origin()}/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token? {'Authorization':`Bearer ${token}`}:{}) },
    body: JSON.stringify(body||{})
  })
  const txt = await res.text()
  try{ const json = JSON.parse(txt); if (!res.ok) throw new Error(json?.error || `CF ${name} failed`); return json }
  catch{ if (!res.ok) throw new Error(txt || `CF ${name} failed`); return { ok:true } }
}
