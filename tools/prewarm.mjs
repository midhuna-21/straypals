
// #!/usr/bin/env node
import fetch from 'node-fetch'
const args = Object.fromEntries(process.argv.slice(2).map((a,i,arr)=> a.startsWith('--') ? [a.replace(/^--/,''), arr[i+1]] : []).filter(Boolean))
const BASE = args.base || 'https://example.com'
const FN   = args.functions || ''
const LIMIT = parseInt(args.limit||'100',10)
const pages = ['/', '/map', '/tasks', '/campaign/pass-the-bowl', '/me']
async function hit(url){ const t0=Date.now(); try{ const r=await fetch(url,{redirect:'follow'}); console.log(`${r.ok?'OK':'ERR '+r.status}`.padEnd(7), (Date.now()-t0)+'ms', url) }catch(e){ console.log('ERR'.padEnd(7),(Date.now()-t0)+'ms',url,e.message) } }
for (const p of pages) await hit(`${BASE}${p}`)
console.log('Done.')
