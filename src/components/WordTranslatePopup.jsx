
import { useEffect, useState } from 'react'
import { lookupWord, translateToVietnamese } from '../lib/translation'

export default function WordTranslatePopup(){
 const [state,setState]=useState(null)
 useEffect(()=>{
  async function onClick(e){
   if(e.target.closest('button,input,select,textarea,a,audio,.word-translate-popup')) return
   if(!e.target.closest('main')) return
   const word=wordAtPoint(e.clientX,e.clientY)
   if(!word||word.length<2)return
   const offline=lookupWord(word)
   setState({word,translation:offline||'Đang dịch…',x:e.clientX,y:e.clientY,loading:!offline})
   if(!offline){
    try{
     const out=await translateToVietnamese(word)
     setState(s=>s&&s.word===word?{...s,translation:out,loading:false}:s)
    }catch{
     setState(s=>s&&s.word===word?{...s,translation:'Chưa có nghĩa offline',loading:false}:s)
    }
   }
  }
  function close(e){if(!e.target.closest('.word-translate-popup'))setState(null)}
  document.addEventListener('click',onClick)
  document.addEventListener('scroll',close,true)
  return()=>{document.removeEventListener('click',onClick);document.removeEventListener('scroll',close,true)}
 },[])
 if(!state)return null
 const left=Math.min(state.x,window.innerWidth-260), top=Math.min(state.y+14,window.innerHeight-130)
 return <div className="word-translate-popup" style={{left:Math.max(8,left),top:Math.max(8,top)}} onClick={e=>e.stopPropagation()}>
   <button className="popup-close" onClick={()=>setState(null)}>×</button>
   <strong>{state.word}</strong><span>{state.translation}</span>
   <small>Tap/click any English word</small>
  </div>
}
function wordAtPoint(x,y){
 let node=null,offset=0
 if(document.caretPositionFromPoint){const p=document.caretPositionFromPoint(x,y);node=p?.offsetNode;offset=p?.offset||0}
 else if(document.caretRangeFromPoint){const r=document.caretRangeFromPoint(x,y);node=r?.startContainer;offset=r?.startOffset||0}
 if(!node||node.nodeType!==Node.TEXT_NODE)return ''
 const text=node.textContent||''
 let a=offset,b=offset
 while(a>0&&/[A-Za-z'-]/.test(text[a-1]))a--
 while(b<text.length&&/[A-Za-z'-]/.test(text[b]))b++
 return text.slice(a,b).replace(/^[-']|[-']$/g,'')
}
