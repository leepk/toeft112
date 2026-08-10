
import { useState } from 'react'
import { translateToVietnamese } from '../lib/translation'

export default function TranslateButton({ text, label='🇻🇳 Translate to Vietnamese', className='' }){
 const [open,setOpen]=useState(false),[translation,setTranslation]=useState(''),[loading,setLoading]=useState(false),[error,setError]=useState('')
 async function toggle(){
  if(open){setOpen(false);return}
  setOpen(true)
  if(translation)return
  setLoading(true);setError('')
  try{setTranslation(await translateToVietnamese(Array.isArray(text)?text.join('\n'):text))}
  catch{setError('Không dịch được lúc này. Hãy kiểm tra Internet hoặc dùng trình duyệt có Translator API.')}
  finally{setLoading(false)}
 }
 return <div className={`translate-wrap ${className}`}>
  <button type="button" className="translate-btn" onClick={toggle}>{open?'Hide Vietnamese':label}</button>
  {open&&<div className="vi-translation">{loading?<span>Đang dịch…</span>:error?<span className="translate-error">{error}</span>:translation.split('\n').map((x,i)=><p key={i}>{x}</p>)}</div>}
 </div>
}
