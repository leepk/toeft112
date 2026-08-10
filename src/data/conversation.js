
const CATEGORIES = {
  'Daily Life': ['morning routine','grocery shopping','coffee shop','restaurant','laundry','post office','pharmacy','gym','hair salon','neighbor chat'],
  'Healthcare': ['doctor appointment','acupuncture visit','insurance benefits','pharmacy pickup','pain discussion','follow-up visit','clinic check-in','treatment plan','medical bill','rescheduling care'],
  'Work & IT': ['daily stand-up','code review','bug report','production incident','API discussion','database issue','deployment','sprint planning','system design','manager update'],
  'Job & Career': ['recruiter call','job interview','salary discussion','onsite requirement','technical interview','follow-up email','offer discussion','resume review','networking event','career change'],
  'Travel': ['airport check-in','flight delay','hotel check-in','train station','rideshare pickup','car rental','lost luggage','asking directions','restaurant while traveling','changing reservation'],
  'Housing': ['apartment tour','maintenance request','rent question','lease renewal','neighbor noise','parking issue','internet setup','utility bill','moving day','package delivery'],
  'Banking': ['opening an account','deposit question','credit card issue','fraud alert','bank transfer','ATM problem','loan question','monthly fee','payment dispute','cash withdrawal'],
  'School': ['class registration','office hours','group project','assignment question','exam preparation','campus office','financial aid','library help','presentation','academic advising'],
  'Shopping': ['returning an item','asking price','finding a size','online order','delivery issue','warranty question','coupon problem','checkout','product recommendation','exchange'],
  'Phone & Service': ['customer service','leaving voicemail','asking to repeat','wrong number','appointment call','internet support','utility support','bank support','clinic call','delivery support']
}
const INTENTS=['ask for clarification','solve a problem','make a request','confirm details','politely disagree','make a suggestion','explain a delay','change a plan','ask a follow-up question','close the conversation']
const LEVELS=['Easy','Developing','Intermediate','Advanced']

function roleLines(category,topic,intent,index){
 const a=category==='Work & IT'?'Developer':category==='Healthcare'?'Patient':category==='Job & Career'?'Candidate':'You'
 const b=category==='Work & IT'?'Teammate':category==='Healthcare'?'Staff':category==='Job & Career'?'Recruiter':'Other person'
 const variants=[
  [`${a}: Hi, I need some help with ${topic}.`,`${b}: Sure. What seems to be the issue?`,`${a}: I want to ${intent}.`,`${b}: Okay, let’s go through the details together.`],
  [`${a}: Excuse me, could I ask you about ${topic}?`,`${b}: Of course. What would you like to know?`,`${a}: I’m trying to ${intent}, but I’m not sure about one detail.`,`${b}: No problem. Let me explain it clearly.`],
  [`${a}: I wanted to follow up about ${topic}.`,`${b}: Sure, what changed?`,`${a}: I need to ${intent}, and I’d like to make sure I understand the options.`,`${b}: That makes sense. Here are the choices we have.`]
 ]
 return variants[index%variants.length]
}

function buildLevel(base,level){
 if(level==='Easy') return base
 if(level==='Developing') return [...base,`You: Thanks. Could you also tell me what I should do next?`,`Other person: Yes. The next step is simple, and I’ll explain it.`]
 if(level==='Intermediate') return [...base,`You: I understand the basic idea, but I want to make sure there isn’t another option.`,`Other person: There is one alternative, although it has a small tradeoff.`,`You: In that case, I’d prefer the option that is easier to complete today.`]
 return [...base,`You: Let me make sure I have this right before we finish.`,`Other person: Sure, go ahead.`,`You: My understanding is that we’ll use the practical option now, and if that doesn’t work, we’ll follow up with the alternative.`,`Other person: Exactly. That’s the best plan based on the current situation.`]
}

const raw=[]
let id=1
Object.entries(CATEGORIES).forEach(([category,topics])=>{
 topics.forEach((topic,ti)=>{
  INTENTS.forEach((intent,ii)=>{
   const base=roleLines(category,topic,intent,ti+ii)
   raw.push({
    id:id++,category,topic,intent,
    title:`${topic} — ${intent}`,
    roles:base[0].split(':')[0]+' / '+base[1].split(':')[0],
    levels:Object.fromEntries(LEVELS.map(l=>[l,buildLevel(base,l)])),
    prompt:`Role-play this situation about ${topic}. Your goal is to ${intent}.`,
    challenge:`Respond naturally without reading the model. Ask at least one follow-up question.`
   })
  })
 })
})
export const conversationLessons=raw
export {LEVELS as CONVERSATION_LEVELS}
