const LEVELS=['Easy','Developing','Intermediate','Advanced']
const CATEGORIES={
 'Daily English':['morning habits','weekend plans','shopping smarter','cooking at home','exercise routines','sleep habits','making friends','small talk','phone etiquette','time management'],
 'US Life':['renting an apartment','using public transit','banking basics','credit cards','health insurance','doctor visits','school systems','customer service','grocery stores','workplace culture'],
 'Technology':['cloud computing','cybersecurity','software architecture','mobile apps','databases','APIs','DevOps','open source','web performance','digital privacy'],
 'AI & ML':['machine learning','large language models','AI agents','computer vision','speech recognition','embeddings','RAG','model evaluation','AI safety','automation'],
 'Healthcare':['acupuncture','chronic pain','sleep and stress','preventive care','patient communication','insurance claims','medical records','exercise recovery','nutrition basics','mental wellness'],
 'Science':['climate systems','space exploration','human brain','genetics','renewable energy','ocean science','ecosystems','vaccines','materials science','astronomy'],
 'Business':['starting a business','customer experience','pricing','leadership','teamwork','negotiation','marketing','product strategy','operations','personal finance'],
 'Academic':['study strategies','note taking','critical thinking','research methods','statistics','public speaking','writing clearly','group projects','exam preparation','reading efficiently'],
 'Career':['job interviews','recruiters','salary negotiation','networking','career growth','remote work','technical interviews','resumes','leadership skills','changing industries'],
 'Math':['probability','linear algebra','calculus','statistics','geometry','functions','graphs','optimization','logic','data interpretation']
}
const FORMATS=['Mini Lecture','Host Interview','News Report','Personal Story','Two Viewpoints']
const scripts={
 'Mini Lecture':(t,c)=>[
  `Welcome back. Today we’re unpacking ${t}, a topic that appears often in ${c.toLowerCase()}.`,
  `Instead of memorizing a definition, start with the problem the idea is meant to solve.`,
  `Imagine two situations that look similar on the surface but differ in one important condition.`,
  `In the first situation, the usual rule works exactly as expected.`,
  `In the second, a hidden constraint changes the outcome and forces us to revise the simple explanation.`,
  `That contrast is useful because it shows where the concept is powerful and where it has limits.`,
  `A practical way to remember the idea is to ask three questions: what is changing, what is being measured, and what else could influence the result?`,
  `Those questions turn ${t} from an abstract term into a tool for reasoning.`,
  `The takeaway is not that one rule always wins, but that good decisions connect a principle to the context in which it is used.`
 ],
 'Host Interview':(t,c)=>[
  `Host: Today I’m joined by a guest who works with ${t}.`,
  `Guest: Thanks. It’s one of those subjects that looks simple until you see how people use it in real situations.`,
  `Host: What do beginners usually get wrong?`,
  `Guest: They often focus on the visible result and skip the question of how that result was produced.`,
  `Host: Can you give us an example?`,
  `Guest: Sure. On one project, everyone wanted a faster outcome, but the real bottleneck was unclear information rather than slow processing.`,
  `Host: So improving speed would not have solved the main problem?`,
  `Guest: Exactly. We first made the process easier to understand, and the overall result improved even before the system became faster.`,
  `Host: What should listeners remember about ${t}?`,
  `Guest: Define the goal first, then choose the method. A sophisticated tool is useful only when it solves the right problem.`
 ],
 'News Report':(t,c)=>[
  `Reporter: A new development involving ${t} is drawing attention in ${c.toLowerCase()}.`,
  `Early reports suggest meaningful benefits, but the results are not uniform.`,
  `One group has reported better access and lower waiting time.`,
  `Another group says the change introduced new costs that were not obvious during the pilot.`,
  `Analysts caution that the first numbers come from a limited sample and may not represent broader use.`,
  `A second phase will compare outcomes across different populations and operating conditions.`,
  `Supporters say the expansion will provide the evidence needed to improve the program.`,
  `Critics want clearer measures of success before additional resources are committed.`,
  `For now, the story of ${t} is less about a final verdict and more about what researchers learn as the evidence grows.`
 ],
 'Personal Story':(t,c)=>[
  `I did not expect ${t} to change the way I approached everyday problems.`,
  `My first experience with it happened when a plan that looked perfectly reasonable stopped working halfway through.`,
  `I kept trying to repair the original plan because I had already invested time in it.`,
  `A friend asked a simple question: what result are you actually trying to protect?`,
  `That question made me realize I was defending the method instead of the goal.`,
  `I chose a smaller alternative, tested it, and discovered that it solved the important part of the problem.`,
  `The experience taught me to separate commitment to an outcome from attachment to a particular solution.`,
  `Now, whenever I work with ${t}, I try to identify the goal, the evidence, and at least one backup.`,
  `That habit has made me more flexible without making my decisions less careful.`
 ],
 'Two Viewpoints':(t,c)=>[
  `Speaker A: I think ${t} is valuable because it can make decisions faster and more consistent.`,
  `Speaker B: I agree about consistency, but speed can hide mistakes if people stop questioning the process.`,
  `Speaker A: That’s fair, although a well-designed system can include checks without giving up efficiency.`,
  `Speaker B: The challenge is deciding which checks are worth the extra time.`,
  `Speaker A: I would base that decision on risk. A reversible mistake needs fewer safeguards than an irreversible one.`,
  `Speaker B: And I would add transparency. People should know why an important recommendation was made.`,
  `Speaker A: So we actually agree that ${t} is not automatically good or bad.`,
  `Speaker B: Right. Its value depends on the goal, the risk, and how responsibly it is implemented.`,
  `Narrator: The disagreement is therefore about priorities, not about whether the concept has any value.`
 ]
}
const extensions=[
 (t)=>[`Before we finish, notice one practical detail: people often understand ${t} better after comparing a successful case with a failure case.`],
 (t)=>[`There is also a useful language point here: listen for contrast words such as however, although, whereas, and instead.`],
 (t)=>[`One unanswered question remains: would the same conclusion hold if cost, time, or scale changed significantly?`],
 (t)=>[`A useful exercise is to pause now and explain ${t} in one sentence without using the exact words from the episode.`],
 (t)=>[`The broader lesson is that evidence becomes more useful when we know the conditions under which it was collected.`]
]
function levelScript(topic,category,format,level,variant){
 const full=[...scripts[format](topic,category),...extensions[variant-1](topic)]
 if(level==='Easy') return full.slice(0,5)
 if(level==='Developing') return full.slice(0,7)
 if(level==='Intermediate') return full.slice(0,9)
 return full
}
let id=1
export const podcastLessons=[]
Object.entries(CATEGORIES).forEach(([category,topics])=>topics.forEach(topic=>FORMATS.forEach((format,i)=>{
 podcastLessons.push({id:id++,category,topic,angle:format,title:`${topic} — ${format}`,levels:Object.fromEntries(LEVELS.map((l,li)=>[l,{script:levelScript(topic,category,format,l,i+1),rate:[.78,.88,.98,1.08][li]}]))})
})))
export {LEVELS as PODCAST_LEVELS}
