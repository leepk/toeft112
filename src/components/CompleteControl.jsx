
import { getContentState, toggleCompleted } from '../lib/contentProgress'
import { useEffect, useState } from 'react'

export default function CompleteControl({type,id,label=''}){
 const [state,setState]=useState(()=>getContentState(type,id))
 useEffect(()=>{
  const sync=()=>setState(getContentState(type,id))
  sync();window.addEventListener('toefl-content-status-updated',sync)
  return()=>window.removeEventListener('toefl-content-status-updated',sync)
 },[type,id])
 const done=state.status==='Completed'
 return <button className={`lesson-complete-control ${done?'done':state.status==='Need Review'?'review':''}`} onClick={()=>toggleCompleted(type,id,label)}>
   <span>{done?'✓':state.status==='Need Review'?'↻':'○'}</span>{done?'Completed':state.status==='Need Review'?'Need Review · Mark Completed':'Mark Completed'}
 </button>
}
