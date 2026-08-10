export default function LibrarySearchFilter({
  query,
  onQueryChange,
  categories = [],
  activeCategory = 'All',
  onCategoryChange,
  countForCategory = () => 0,
  placeholder = 'Search…'
}) {
  return (
    <div className="library-search-filter panel">
      <div className="search light-search">
        <span>⌕</span>
        <input value={query} onChange={e=>onQueryChange(e.target.value)} placeholder={placeholder}/>
      </div>
      <div className="category-scroll">
        {categories.map(c=><button type="button" key={c} className={activeCategory===c?'active':''} onClick={()=>onCategoryChange(c)}>{c} <small>{countForCategory(c)}</small></button>)}
      </div>
    </div>
  )
}
