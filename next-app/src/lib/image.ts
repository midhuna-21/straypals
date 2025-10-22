
export async function stripExifAndResize(file: File, maxW=1600, maxH=1600, mime='image/jpeg', quality=0.9): Promise<Blob>{
  const img = await fileToImage(file)
  const { w, h } = fitContain(img.naturalWidth, img.naturalHeight, maxW, maxH)
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, w, h)
  return await new Promise<Blob>((resolve, reject)=>{
    canvas.toBlob(b => b? resolve(b) : reject(new Error('toBlob failed')), mime, quality)
  })
}
export async function toLqipDataUrl(fileOrBlob: Blob, targetW=24, targetH=24): Promise<string>{
  const img = await fileToImage(fileOrBlob)
  const { w, h } = fitContain(img.naturalWidth, img.naturalHeight, targetW, targetH)
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', 0.5)
}
function fileToImage(file: Blob): Promise<HTMLImageElement>{
  return new Promise((resolve, reject)=>{
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = ()=>{ URL.revokeObjectURL(url); resolve(img) }
    img.onerror = (e)=>{ URL.revokeObjectURL(url); reject(e) }
    img.src = url
  })
}
function fitContain(w:number,h:number,maxW:number,maxH:number){
  const r = Math.min(maxW/w, maxH/h, 1)
  return { w: Math.round(w*r), h: Math.round(h*r) }
}
