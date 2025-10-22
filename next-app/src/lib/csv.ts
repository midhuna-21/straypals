
import { auth } from './firebase'
import { functionsBase } from './cfClient'
export async function downloadCsvFromFunction(name: string, body: any, filename='export.csv'){
  const u=auth.currentUser; const token=u? await u.getIdToken():null
  const res=await fetch(`${functionsBase()}/${name}`, { method:'POST', headers:{ 'Content-Type':'application/json','Accept':'text/csv', ...(token? {'Authorization':`Bearer ${token}`}:{}) }, body: JSON.stringify(body||{}) })
  const blob=await res.blob(); if(!res.ok){ const t=await blob.text().catch(()=> ''); throw new Error(t||`CF ${name} failed`) }
  const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
}
