
export default function StatusFilter({value,onChange,counts}){
 const items=[
  ['All',counts.total],
  ['Not Started',Math.max(0,counts.total-counts.completed-counts.inProgress-counts.review)],
  ['In Progress',counts.inProgress],
  ['Completed',counts.completed],
  ['Need Review',counts.review]
 ]
 return <div className="status-filter">{items.map(([x,n])=><button type="button" key={x} disabled={n===0&&x!=='All'} className={value===x?'active':''} onClick={()=>onChange(x)}>{x}<small>{n}</small></button>)}</div>
}
