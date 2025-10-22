
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { callFunctionAuthorized } from './cfClient'
const KEY='sp_ref', KEY_LOG='sp_ref_log'
type Ref={ via:string; campaign?:string; ts:number; src?:string }
export function captureReferralFromUrl(url?:string){
  if (typeof window==='undefined') return
  try{ const u=new URL(url||location.href); const via=u.searchParams.get('via'); const campaign=u.searchParams.get('campaign')||undefined; if(!via) return; localStorage.setItem(KEY, JSON.stringify({via, campaign, ts:Date.now(), src:document.referrer||undefined})) }catch{}
}
export function getStoredReferral():Ref|null{ if(typeof window==='undefined')return null; try{const s=localStorage.getItem(KEY); return s? JSON.parse(s):null}catch{return null} }
function mark(ev:string){ try{const raw=localStorage.getItem(KEY_LOG); const set=new Set<string>(raw? JSON.parse(raw):[]); set.add(ev); localStorage.setItem(KEY_LOG, JSON.stringify([...set]))}catch{} }
function done(ev:string){ try{const raw=localStorage.getItem(KEY_LOG); const arr:string[]=raw? JSON.parse(raw):[]; return arr.includes(ev)}catch{return false} }
export function initReferralCapture(router?: any){ if(typeof window==='undefined')return; captureReferralFromUrl(); if(router && router.events && !('__sp_referral_hooked' in router.events)){ router.events.on('routeChangeComplete',(url:string)=>captureReferralFromUrl(url)); (router.events as any)['__sp_referral_hooked']=true } onAuthStateChanged(auth, async(u)=>{ if(!u||done('signup'))return; const ref=getStoredReferral(); if(!ref||!ref.via)return; try{ await callFunctionAuthorized('recordReferralConversion',{ referrerUid: ref.via, campaign: ref.campaign||'unknown', event:'signup' }); mark('signup') }catch{} }) }
export async function maybeRecordReferralConversion(event:'volunteer'|'checkin'){ try{ if(done(event))return; const ref=getStoredReferral(); if(!ref||!ref.via)return; await callFunctionAuthorized('recordReferralConversion',{ referrerUid: ref.via, campaign: ref.campaign||'unknown', event }); mark(event) }catch{} }
