import { useEffect, useMemo, useState } from 'react'
import { lessons } from './data/course'
import ProgressRing from './components/ProgressRing'
import SpeakingPractice from './components/SpeakingPractice'
import LessonContent from './components/LessonContent'
import VocabularyPractice from './components/VocabularyPractice'
import PronunciationPage from './components/PronunciationPage'
import DailyPracticePage from './components/DailyPracticePage'
import ListeningPage from './components/ListeningPage'
import SpeakingLibraryPage from './components/SpeakingLibraryPage'
import DomainVocabularyPage from './components/DomainVocabularyPage'
import ConversationPage from './components/ConversationPage'
import PodcastPage from './components/PodcastPage'
import WordTranslatePopup from './components/WordTranslatePopup'
import LearningDashboard from './components/LearningDashboard'
import { domainVocabulary } from './data/domainVocabulary'
import { setDomainGlossary } from './lib/translation'

const loadProgress = () => {
  try { return JSON.parse(localStorage.getItem('toefl112-progress') || '{}') } catch { return {} }
}

export default function App() {
  const [page, setPage] = useState(() => localStorage.getItem('toefl112-page') || 'lessons')
  const [progress, setProgress] = useState(loadProgress)
  const [selectedDay, setSelectedDay] = useState(() => {
    const done = loadProgress();
    return lessons.find(l => !done[l.day])?.day || 112
  })
  const [query, setQuery] = useState('')
  const [weekFilter, setWeekFilter] = useState('all')
  const [focusFilter, setFocusFilter] = useState('all')
  const [duration, setDuration] = useState(() => (localStorage.getItem('toefl112-duration') === '45' ? 45 : 30))
  const [viewMode, setViewMode] = useState(() => window.matchMedia('(max-width: 899px)').matches ? 'mobile' : 'pc')

  useEffect(() => localStorage.setItem('toefl112-page', page), [page])
  useEffect(() => localStorage.setItem('toefl112-progress', JSON.stringify(progress)), [progress])
  useEffect(() => localStorage.setItem('toefl112-duration', String(duration)), [duration])
  useEffect(() => {
    setDomainGlossary(domainVocabulary)
    const media = window.matchMedia('(max-width: 899px)')
    const sync = () => setViewMode(media.matches ? 'mobile' : 'pc')
    sync()
    media.addEventListener?.('change', sync)
    return () => media.removeEventListener?.('change', sync)
  }, [])

  const completed = Object.values(progress).filter(Boolean).length
  const percent = completed / 112 * 100
  const lesson = lessons[selectedDay - 1]
  const filtered = useMemo(() => lessons.filter(l => {
    const q = query.trim().toLowerCase()
    return (!q || `${l.day} ${l.title} ${l.focus} ${l.phase}`.toLowerCase().includes(q)) &&
      (weekFilter === 'all' || l.week === Number(weekFilter)) &&
      (focusFilter === 'all' || l.focus === focusFilter)
  }), [query, weekFilter, focusFilter])

  const toggleComplete = (day) => setProgress(p => ({...p, [day]: !p[day]}))
  const taskTotal = lesson.tasks.reduce((n,t) => n + t.minutes, 0)
  const visibleTasks = duration === 45 ? lesson.tasks : trimTasks(lesson, 30)
  const showSpeaking = lesson.focus === 'Speaking' || lesson.focus === 'Mixed'

  return (
    <div className={`app-shell mode-${viewMode}`}>
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">T</div><div><strong>TOEFL 112</strong><span>16-week study plan</span></div></div>
        <div className="side-stat"><ProgressRing value={percent}/><p><strong>{completed}</strong> of 112 days done</p></div>
        <div className="app-menu"><button className={page==='learning'?'active':''} onClick={()=>setPage('learning')}>◎ <span>My Learning</span></button><button className={page==='lessons'?'active':''} onClick={()=>setPage('lessons')}>▣ <span>Lessons</span></button><button className={page==='daily'?'active':''} onClick={()=>setPage('daily')}>◈ <span>Daily Practice</span></button><button className={page==='pronounce'?'active':''} onClick={()=>setPage('pronounce')}>◉ <span>Pronounce</span></button><button className={page==='listening'?'active':''} onClick={()=>setPage('listening')}>◫ <span>Listening</span></button><button className={page==='speakinglib'?'active':''} onClick={()=>setPage('speakinglib')}>◍ <span>Speaking</span></button><button className={page==='vocablib'?'active':''} onClick={()=>setPage('vocablib')}>◆ <span>Vocabulary+</span></button><button className={page==='conversation'?'active':''} onClick={()=>setPage('conversation')}>◌ <span>Conversation</span></button><button className={page==='podcast'?'active':''} onClick={()=>setPage('podcast')}>◧ <span>Podcast</span></button></div>
        {page === 'lessons' && <><div className="filter-block">
          <div className="search"><span className="mini-icon">⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search lessons"/></div>
          <select value={weekFilter} onChange={e=>setWeekFilter(e.target.value)}><option value="all">All weeks</option>{Array.from({length:16},(_,i)=><option key={i+1} value={i+1}>Week {i+1}</option>)}</select>
          <select value={focusFilter} onChange={e=>setFocusFilter(e.target.value)}><option value="all">All skills</option>{['Reading','Listening','Speaking','Writing','Mixed','Review'].map(x=><option key={x}>{x}</option>)}</select>
        </div>
        <div className="lesson-list">
          {filtered.map(l => <button key={l.day} onClick={()=>setSelectedDay(l.day)} className={selectedDay===l.day?'lesson-link active':'lesson-link'}>
            <span className={progress[l.day]?'day-dot done':'day-dot'}>{progress[l.day] ? <span>✓</span> : l.day}</span>
            <span><strong>Day {l.day}</strong><small>{l.focus} · W{l.week}</small></span>
          </button>)}
        </div></>}
      </aside>

      <main>
        {page === 'learning' ? <><header className="topbar pronunciation-topbar"><div><span className="eyebrow">Progress & review</span><h1>My Learning</h1></div></header><LearningDashboard onGoDaily={()=>setPage('daily')}/></> : page === 'conversation' ? <><header className="topbar pronunciation-topbar"><div><span className="eyebrow">Speaking reflex</span><h1>Conversation</h1></div></header><ConversationPage/></> : page === 'podcast' ? <><header className="topbar pronunciation-topbar"><div><span className="eyebrow">Listening library</span><h1>Podcast</h1></div></header><PodcastPage/></> : page === 'vocablib' ? <><header className="topbar pronunciation-topbar"><div><span className="eyebrow">Professional English</span><h1>Vocabulary+</h1></div></header><DomainVocabularyPage/></> : page === 'listening' ? <><header className="topbar pronunciation-topbar"><div><span className="eyebrow">Practice library</span><h1>Listening</h1></div></header><ListeningPage/></> : page === 'speakinglib' ? <><header className="topbar pronunciation-topbar"><div><span className="eyebrow">Practice library</span><h1>Speaking</h1></div></header><SpeakingLibraryPage/></> : page === 'daily' ? <><header className="topbar pronunciation-topbar"><div><span className="eyebrow">Adaptive daily training</span><h1>Daily Practice</h1></div></header><DailyPracticePage/></> : page === 'pronounce' ? <><header className="topbar pronunciation-topbar"><div><span className="eyebrow">Browser-native training</span><h1>Pronunciation</h1></div></header><PronunciationPage/></> : <>
        <header className="topbar">
          <div><span className="eyebrow">{lesson.phase} · Week {lesson.week}</span><h1>Day {lesson.day}: {lesson.title}</h1></div>
          <div className="top-controls">
            
            <div className="duration-toggle"><button className={duration===30?'on':''} onClick={()=>setDuration(30)}>30 min</button><button className={duration===45?'on':''} onClick={()=>setDuration(45)}>45 min</button></div>
          </div>
        </header>

        <section className="hero-card">
          <div><div className="icon-bubble"><span className="target-icon">◎</span></div><span className="eyebrow">Today's objective</span><h2>{lesson.objective}</h2><div className="meta"><span><span>◷</span>{duration === 45 ? taskTotal : '~30'} minutes</span><span><span>▣</span>{lesson.focus}</span></div></div>
          <button className={progress[lesson.day]?'complete-btn done':'complete-btn'} onClick={()=>toggleComplete(lesson.day)}><span>✓</span>{progress[lesson.day]?'Completed':'Mark complete'}</button>
        </section>

        <div className="content-grid">
          <div className="main-col">
            <section className="panel"><div className="panel-head"><h3>Study session</h3><span>{visibleTasks.reduce((n,t)=>n+t.minutes,0)} min</span></div>
              <div className="timeline">{visibleTasks.map((t,i)=><article className="task" key={i}><div className="task-time">{t.minutes}<small>min</small></div><div><span className="task-type">{t.type}</span><p>{t.text}</p>{t.resource&&<a href={t.resource.url} target="_blank" rel="noreferrer">{t.resource.label}<span>↗</span></a>}</div></article>)}</div>
            </section>
            <LessonContent lesson={lesson}/>
            <VocabularyPractice items={lesson.vocabularyPractice}/>
            {showSpeaking && <SpeakingPractice lesson={lesson}/>} 
          </div>

          <div className="right-col">
            <section className="panel"><div className="panel-head"><h3>Vocabulary</h3><span>10 words</span></div><div className="chips">{lesson.vocabulary.map(v=><span key={v}>{v}</span>)}</div></section>
            <section className="panel"><div className="panel-head"><h3>Finish strong</h3></div><div className="checks">{lesson.checklist.map((c,i)=><label key={i}><input type="checkbox"/> <span>{c}</span></label>)}</div></section>
            <section className="panel week-progress"><div className="panel-head"><h3>Week {lesson.week}</h3></div><div className="week-days">{lessons.filter(x=>x.week===lesson.week).map(x=><button onClick={()=>setSelectedDay(x.day)} key={x.day} className={progress[x.day]?'done':''}>D{x.day}</button>)}</div></section>
          </div>
        </div>

        <footer className="nav-footer"><button disabled={lesson.day===1} onClick={()=>setSelectedDay(d=>Math.max(1,d-1))}><span>‹</span> Previous</button><span>Day {lesson.day} of 112</span><button disabled={lesson.day===112} onClick={()=>setSelectedDay(d=>Math.min(112,d+1))}>Next <span>›</span></button></footer></>}
      </main>

      <nav className="mobile-bottom-nav app-mobile-nav">
        <button className={page==='lessons'?'nav-active':''} onClick={()=>setPage('lessons')}>▣<small>Lessons</small></button>
        {page==='lessons' && <button disabled={lesson.day===1} onClick={()=>setSelectedDay(d=>Math.max(1,d-1))}>‹<small>Prev</small></button>}
        <button className={page==='daily'?'nav-active':''} onClick={()=>setPage('daily')}>◈<small>Daily</small></button><button className={page==='pronounce'?'nav-active':''} onClick={()=>setPage('pronounce')}>◉<small>Pronounce</small></button><button className={page==='listening'?'nav-active':''} onClick={()=>setPage('listening')}>◫<small>Listen</small></button><button className={page==='speakinglib'?'nav-active':''} onClick={()=>setPage('speakinglib')}>◍<small>Speak</small></button><button className={page==='vocablib'?'nav-active':''} onClick={()=>setPage('vocablib')}>◆<small>Vocab+</small></button><button className={page==='conversation'?'nav-active':''} onClick={()=>setPage('conversation')}>◌<small>Talk</small></button><button className={page==='podcast'?'nav-active':''} onClick={()=>setPage('podcast')}>◧<small>Podcast</small></button>
        {page==='lessons' && <button disabled={lesson.day===112} onClick={()=>setSelectedDay(d=>Math.min(112,d+1))}>›<small>Next</small></button>}
      </nav>
      <WordTranslatePopup/>
    </div>
  )
}

function trimTasks(lesson, max){
  let remaining=max
  return lesson.tasks.flatMap(t=>{
    if(remaining<=0) return []
    const minutes=Math.min(t.minutes,remaining)
    remaining-=minutes
    return [{...t,minutes}]
  })
}
