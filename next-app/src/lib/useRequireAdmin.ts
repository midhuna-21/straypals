
import { useEffect, useState } from 'react'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
export function useRequireAdmin(){
  const [ready,setReady]=useState(false),[allowed,setAllowed]=useState(false)
  useEffect(()=> onAuthStateChanged(auth, async(u)=>{ if(!u){setReady(true);setAllowed(false);return} try{ const s=await getDoc(doc(db,'users', u.uid)); const roles:string[]=s.exists()? ((s.data() as any).roles||[]): []; setAllowed(Array.isArray(roles)&&roles.some(r=>['mod','ngo_admin','superadmin'].includes(r))) } finally { setReady(true) } }), [])
  return {ready,allowed}
}
