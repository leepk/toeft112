const resources = {
  ets: { label: 'ETS TOEFL Prepare', url: 'https://www.ets.org/toefl/test-takers/ibt/prepare.html' },
  testready: { label: 'TOEFL TestReady', url: 'https://testready.ets.org/' },
  voa: { label: 'VOA Learning English', url: 'https://learningenglish.voanews.com/' },
  bbc: { label: 'BBC Learning English', url: 'https://www.bbc.co.uk/learningenglish' },
  ted: { label: 'TED Talks', url: 'https://www.ted.com/talks' },
}

const topics = [
  'artificial intelligence', 'cloud computing', 'healthcare technology', 'renewable energy',
  'education', 'urban transportation', 'climate science', 'space exploration',
  'digital privacy', 'robotics', 'business innovation', 'public health',
  'ocean science', 'psychology', 'agriculture', 'history of technology'
]

const vocabBank = [
  ['analyze','approach','assess','benefit','concept','context','derive','evidence','factor','impact'],
  ['adapt','allocate','assume','category','complex','conclude','contrast','data','estimate','function'],
  ['identify','indicate','interpret','method','occur','process','require','significant','structure','vary'],
  ['achieve','alternative','available','consistent','design','evaluate','feature','maintain','potential','relevant'],
]



const topicIdeas = {
  'artificial intelligence': ['Artificial intelligence can recognize patterns in large amounts of data.', 'In healthcare, these systems may help clinicians identify risks earlier.', 'However, human judgment remains important when decisions affect people directly.', 'Researchers also study bias because training data can influence model behavior.', 'The strongest systems combine useful automation with careful oversight.'],
  'cloud computing': ['Cloud computing allows organizations to use shared computing resources over a network.', 'Teams can increase or reduce capacity without buying new hardware for every change.', 'This flexibility can lower initial costs and support faster experimentation.', 'At the same time, security and reliability require clear architecture and monitoring.', 'For many companies, cloud strategy is now part of long-term business planning.'],
  'healthcare technology': ['Healthcare technology can improve how information moves between patients and clinicians.', 'Electronic records make it easier to review history, medications, and test results.', 'Remote monitoring can also help patients who live far from a clinic.', 'Still, privacy and data quality are essential because medical decisions depend on accurate information.', 'Successful tools support clinical work instead of adding unnecessary complexity.'],
  'renewable energy': ['Renewable energy comes from sources that can be naturally replenished.', 'Solar and wind power have become more common as technology has improved.', 'Their output can change with weather, so storage and grid planning are important.', 'Communities often compare cost, reliability, and environmental impact before investing.', 'A balanced energy system may combine several technologies rather than depend on only one source.'],
  'education': ['Education is most effective when learners actively work with new ideas.', 'Reading alone can build knowledge, but practice helps students remember and apply it.', 'Discussion also forces learners to organize thoughts and explain evidence clearly.', 'Digital tools can provide flexible access to lessons and immediate feedback.', 'The best approach depends on the learner, the subject, and the learning goal.'],
  'urban transportation': ['Urban transportation shapes how people reach work, school, and essential services.', 'Reliable public transit can reduce congestion when it is convenient and frequent.', 'Walking and cycling networks can make short trips safer and more efficient.', 'Cities must also consider cost, accessibility, and the needs of different neighborhoods.', 'Transportation planning therefore affects both economic activity and quality of life.'],
  'climate science': ['Climate science studies long-term patterns in temperature, rainfall, oceans, and the atmosphere.', 'Scientists use observations, historical records, and computer models to understand change.', 'A single weather event does not by itself prove a climate trend.', 'Instead, researchers examine patterns across many years and regions.', 'This evidence helps societies evaluate risks and plan for future conditions.'],
  'space exploration': ['Space exploration expands knowledge about planets, stars, and the history of the solar system.', 'Robotic missions can travel to environments that are dangerous for humans.', 'Human missions, however, can perform flexible experiments and repair equipment directly.', 'Both approaches require careful engineering because failures are difficult to correct far from Earth.', 'New missions often create technologies that later support research on Earth.'],
  'digital privacy': ['Digital privacy concerns how personal information is collected, stored, and shared.', 'Many online services depend on data to personalize features and prevent fraud.', 'Users may not always understand how much information a service retains.', 'Strong privacy practices include clear consent, limited collection, and secure storage.', 'Good design tries to provide useful services without collecting more data than necessary.'],
  'robotics': ['Robotics combines software, sensors, electronics, and mechanical systems.', 'A robot must interpret information from its environment before choosing an action.', 'Small errors in sensing can become larger problems if the control system does not compensate.', 'Engineers therefore test robots under many conditions instead of only ideal ones.', 'Modern robots are increasingly used in manufacturing, medicine, logistics, and research.'],
  'business innovation': ['Business innovation is the process of creating new value through products, services, or operations.', 'A useful idea must solve a real problem rather than simply use new technology.', 'Companies often test small experiments before making a large investment.', 'Customer feedback can reveal assumptions that were incorrect at the beginning.', 'Innovation is more sustainable when teams measure results and learn quickly.'],
  'public health': ['Public health focuses on improving health across communities and populations.', 'Prevention programs may reduce disease before people need individual treatment.', 'Clear communication is important because people make decisions based on the information they receive.', 'Researchers use data to identify patterns and evaluate whether programs are effective.', 'Public health decisions often balance individual choice with community benefit.'],
  'ocean science': ['Ocean science examines marine ecosystems, water chemistry, currents, and climate interactions.', 'The ocean stores and moves large amounts of heat around the planet.', 'Marine organisms also form complex food systems that support human communities.', 'Pollution and changing temperatures can disturb these systems in different ways.', 'Long-term observation helps scientists understand changes that are difficult to see in a short study.'],
  'psychology': ['Psychology studies behavior, thought, emotion, and decision making.', 'Researchers design experiments to test explanations rather than rely only on personal experience.', 'Human behavior can change depending on context, expectations, and social influence.', 'Because people are complex, one study rarely explains every situation.', 'Strong conclusions usually come from repeated evidence across different groups and methods.'],
  'agriculture': ['Agriculture depends on soil, water, climate, labor, and technology.', 'Farmers continually adjust methods to improve yield while controlling costs.', 'Precision tools can help apply water or fertilizer only where it is needed.', 'Sustainable practices also try to protect soil quality over many growing seasons.', 'Food systems are strongest when productivity and long-term resource health are considered together.'],
  'history of technology': ['The history of technology shows how inventions develop through many small improvements.', 'A major breakthrough often depends on earlier tools, materials, and scientific knowledge.', 'New technology can change work, communication, and daily habits.', 'Society also influences which inventions spread quickly and which remain limited.', 'Studying this history helps explain why technical change is rarely a simple straight line.']
}

const vocabExamples = {
  analyze:'Researchers analyze the evidence before they draw a conclusion.', approach:'A practical approach can make a complex problem easier to solve.', assess:'Engineers assess risk before they release a new system.', benefit:'One major benefit of public transit is reduced traffic congestion.', concept:'The concept becomes clearer when students connect it to an example.', context:'A word can have a different meaning depending on the context.', derive:'Scientists derive conclusions from repeated observations.', evidence:'Strong evidence should support the main claim.', factor:'Cost is one important factor in the final decision.', impact:'Small design choices can have a significant impact on users.',
  adapt:'Successful teams adapt when conditions change.', allocate:'Managers allocate resources according to project priorities.', assume:'We should not assume that one result applies to every situation.', category:'Each example belongs to a different category.', complex:'A complex system is easier to understand when it is divided into smaller parts.', conclude:'The researchers conclude that more data is needed.', contrast:'The article contrasts two approaches to the same problem.', data:'Reliable data helps people make better decisions.', estimate:'The team used previous results to estimate the future cost.', function:'This component has an important function in the larger system.',
  identify:'The test helps doctors identify possible risks early.', indicate:'The results indicate a clear change in behavior.', interpret:'Students must interpret the graph before answering the question.', method:'The researchers tested a new method for collecting information.', occur:'Errors can occur when requirements are unclear.', process:'A clear process reduces unnecessary work.', require:'Some tasks require careful planning before execution.', significant:'The study found a significant difference between the two groups.', structure:'A clear structure makes an argument easier to follow.', vary:'Results may vary across different populations.',
  achieve:'Teams achieve better outcomes when goals are measurable.', alternative:'The city considered an alternative transportation plan.', available:'The service is available to students throughout the semester.', consistent:'A consistent routine makes daily practice easier.', design:'Good design makes important actions easy to understand.', evaluate:'Reviewers evaluate both the evidence and the reasoning.', feature:'This feature helps users complete the task more quickly.', maintain:'Developers maintain the system after it is released.', potential:'The new method has the potential to reduce costs.', relevant:'Include only evidence that is relevant to the question.'
}

function buildReading(topic) {
  const lines = topicIdeas[topic] || topicIdeas.education
  return { title: `${titleCase(topic)} — short academic passage`, lines }
}

function buildListening(topic) {
  const base = topicIdeas[topic] || topicIdeas.education
  return { title: `Mini lecture: ${titleCase(topic)}`, lines: [
    `Today we are going to look at ${topic} and why it matters in everyday decisions.`,
    base[0],
    `A useful point to remember is that one advantage rarely tells the whole story.`,
    base[2],
    `For that reason, researchers usually compare evidence, limitations, and practical consequences before reaching a conclusion.`
  ] }
}

function buildSpeaking(topic) {
  const base = topicIdeas[topic] || topicIdeas.education
  return {
    sentences: [base[0], base[2], base[4]],
    model: [`In my view, ${topic} is important because it can improve how people solve real problems.`, `For example, ${base[0].charAt(0).toLowerCase()+base[0].slice(1)}`, 'At the same time, people should consider limitations and use evidence before making a final decision.']
  }
}

function buildVocabPractice(vocabulary) {
  return vocabulary.map(word => ({ word, sentence: vocabExamples[word] || `Use the word ${word} in a clear academic sentence.` }))
}

function titleCase(text){ return text.replace(/\b\w/g, c=>c.toUpperCase()) }

const focusCycle = ['Reading','Listening','Speaking','Writing','Mixed','Review','Mixed']

function phaseFor(day) {
  if (day <= 28) return 'Foundation'
  if (day <= 56) return 'Skill Building'
  if (day <= 84) return 'TOEFL Practice'
  return 'Mock Test & Review'
}

function lessonFor(day) {
  const week = Math.ceil(day / 7)
  const focus = focusCycle[(day - 1) % 7]
  const topic = topics[(day - 1) % topics.length]
  const phase = phaseFor(day)
  const vocabulary = vocabBank[(week - 1) % vocabBank.length].map((w, i) => `${w}${i < 5 ? '' : ''}`)
  const dayInWeek = ((day - 1) % 7) + 1

  const foundation = {
    Reading: [
      { minutes: 8, type: 'Vocabulary', text: `Review 10 academic words. Say one sentence aloud for each of the first 5 words.` },
      { minutes: 15, type: 'Reading', text: `Read one short article about ${topic}. Write the main idea and 3 supporting details.`, resource: resources.voa },
      { minutes: 10, type: 'TOEFL skill', text: `Practice 5 questions: vocabulary-in-context, factual detail, and main idea.`, resource: resources.testready },
      { minutes: 5, type: 'Review', text: 'Write one mistake you made and why the correct answer is better.' }
    ],
    Listening: [
      { minutes: 8, type: 'Vocabulary', text: 'Review 10 academic words and listen to their pronunciation.' },
      { minutes: 15, type: 'Listening', text: `Listen to one 6–10 minute lesson or talk about ${topic}. First pass: no subtitles. Second pass: English subtitles.`, resource: resources.bbc },
      { minutes: 10, type: 'Notes', text: 'Write Topic / Main idea / Detail 1 / Detail 2 / Speaker conclusion.' },
      { minutes: 5, type: 'Speaking', text: 'Give a 45-second oral summary from your notes.' }
    ],
    Speaking: [
      { minutes: 8, type: 'Vocabulary', text: 'Review 10 words and choose 3 to use in your answer.' },
      { minutes: 8, type: 'Strategy', text: 'Watch one TOEFL speaking strategy lesson.' },
      { minutes: 15, type: 'Speaking', text: `Record a 45-second answer: “How can ${topic} improve everyday life?” Use Answer → Reason → Example → Conclusion.` },
      { minutes: 7, type: 'Self-review', text: 'Listen once. Check pauses, grammar, pronunciation, and whether you gave a specific example.' }
    ],
    Writing: [
      { minutes: 8, type: 'Vocabulary', text: 'Review 10 words and write 3 transition phrases.' },
      { minutes: 8, type: 'Strategy', text: 'Review an Academic Discussion or Integrated Writing example.' },
      { minutes: 15, type: 'Writing', text: `Write 120–150 words: “What is one benefit and one risk of ${topic}?” Give a clear position and one example.` },
      { minutes: 5, type: 'Edit', text: 'Underline your thesis, transitions, and 3 sentences you can make more concise.' }
    ],
    Mixed: [
      { minutes: 10, type: 'Reading', text: `Read a short article about ${topic} and write a 2-sentence summary.`, resource: resources.voa },
      { minutes: 10, type: 'Listening', text: 'Listen to a short English lesson and take 5 bullet notes.', resource: resources.bbc },
      { minutes: 10, type: 'Speaking', text: 'Record a 60-second summary using your notes.' },
      { minutes: 5, type: 'Vocabulary', text: 'Review the 10 words from this week that you forget most often.' }
    ],
    Review: [
      { minutes: 10, type: 'Vocabulary review', text: 'Test yourself on this week’s vocabulary without looking at definitions.' },
      { minutes: 10, type: 'Error log', text: 'Review all mistakes from the previous 5 study days. Group them by Reading / Listening / Speaking / Writing.' },
      { minutes: 15, type: 'Mini test', text: 'Complete one short official practice set.', resource: resources.testready },
      { minutes: 5, type: 'Plan', text: 'Choose one weakness to prioritize next week.' }
    ]
  }

  let tasks = foundation[focus]
  let title = `${focus}: ${topic.charAt(0).toUpperCase() + topic.slice(1)}`
  let objective = `Build ${focus.toLowerCase()} accuracy and academic English using ${topic}.`

  if (phase === 'Skill Building') {
    const skillText = {
      Reading: 'Practice inference, sentence simplification, reference, and rhetorical-purpose questions under time pressure.',
      Listening: 'Practice lecture structure, attitude/purpose questions, and efficient note-taking.',
      Speaking: 'Practice TOEFL speaking organization, timing, transitions, and concise delivery.',
      Writing: 'Practice thesis clarity, integrated source use, cohesion, and grammatical control.',
      Mixed: 'Combine two TOEFL sections back-to-back with limited transition time.',
      Review: 'Analyze your error log and repeat the hardest question types.'
    }
    objective = skillText[focus]
    tasks = tasks.map((t, i) => i === 0 ? t : { ...t, minutes: Math.min(t.minutes + 1, 16) })
    if (focus === 'Reading') tasks[2] = { minutes: 12, type: 'Timed drill', text: 'Answer 8 TOEFL-style reading questions in 12 minutes. Flag any answer that is not supported directly by the passage.', resource: resources.testready }
    if (focus === 'Listening') tasks[1] = { minutes: 16, type: 'Timed listening', text: 'Complete one conversation or lecture without pausing. Take notes only on structure, examples, contrast, and conclusion.', resource: resources.testready }
    if (focus === 'Speaking') tasks[2] = { minutes: 16, type: 'Timed speaking', text: 'Do 2 speaking responses. Use the official preparation time and stop exactly at the task time limit.' }
    if (focus === 'Writing') tasks[2] = { minutes: 18, type: 'Timed writing', text: 'Write one concise TOEFL response. Spend 2 minutes planning, then write without stopping to over-edit.' }
  }

  if (phase === 'TOEFL Practice') {
    objective = `Perform ${focus.toLowerCase()} tasks closer to real test timing and record your accuracy.`
    title = `Timed TOEFL ${focus} Practice`
    if (focus === 'Reading') tasks = [
      { minutes: 5, type: 'Warm-up', text: 'Review your top 5 reading error patterns.' },
      { minutes: 25, type: 'Timed set', text: 'Complete one official reading practice set without pausing.', resource: resources.testready },
      { minutes: 10, type: 'Review', text: 'For every wrong answer, write the exact sentence or logic that proves the correct answer.' }
    ]
    if (focus === 'Listening') tasks = [
      { minutes: 5, type: 'Warm-up', text: 'Review note-taking symbols for cause, contrast, example, and conclusion.' },
      { minutes: 25, type: 'Timed set', text: 'Complete one official listening set without replaying audio.', resource: resources.testready },
      { minutes: 10, type: 'Review', text: 'Rewrite your notes into a clean outline and identify where you missed the speaker’s purpose.' }
    ]
    if (focus === 'Speaking') tasks = [
      { minutes: 5, type: 'Warm-up', text: 'Say 5 transition phrases aloud at natural speed.' },
      { minutes: 25, type: 'Timed set', text: 'Complete 3–4 speaking tasks. Record every response and do not restart.' },
      { minutes: 10, type: 'Review', text: 'Score yourself 1–4 for delivery, language use, and topic development.' }
    ]
    if (focus === 'Writing') tasks = [
      { minutes: 5, type: 'Warm-up', text: 'Write one thesis and three strong transitions.' },
      { minutes: 25, type: 'Timed set', text: 'Complete one timed writing task using official-style practice.', resource: resources.testready },
      { minutes: 10, type: 'Review', text: 'Edit only for repeated grammar errors, unclear pronouns, weak examples, and unnecessary words.' }
    ]
    if (focus === 'Mixed') tasks = [
      { minutes: 18, type: 'Section A', text: 'Complete a short Reading or Listening drill.', resource: resources.testready },
      { minutes: 15, type: 'Section B', text: 'Immediately complete one Speaking or Writing task.' },
      { minutes: 7, type: 'Review', text: 'Record accuracy and one thing that got worse when you were tired.' }
    ]
    if (focus === 'Review') tasks = foundation.Review
  }

  if (phase === 'Mock Test & Review') {
    const mockWeek = week - 12
    title = dayInWeek === 6 ? `Mock Test ${mockWeek}` : `Mock Prep: ${focus}`
    objective = dayInWeek === 6 ? 'Simulate a longer TOEFL practice session and record section scores.' : 'Fix weaknesses discovered in mock testing.'
    if (dayInWeek === 6) {
      tasks = [
        { minutes: 40, type: 'Mock test', text: 'Complete the longest official practice block you can fit today. Do not pause, check answers, or use a dictionary.', resource: resources.testready },
        { minutes: 5, type: 'Score log', text: 'Record raw accuracy, hardest question type, and one pacing issue.' }
      ]
    } else if (dayInWeek === 7) {
      tasks = [
        { minutes: 15, type: 'Mock review', text: 'Review every error from yesterday. Separate knowledge errors from timing errors.' },
        { minutes: 10, type: 'Redo', text: 'Redo the 5 hardest questions without looking at answers.' },
        { minutes: 10, type: 'Speaking/Writing repair', text: 'Redo your weakest response with a cleaner structure.' },
        { minutes: 5, type: 'Plan', text: 'Write one measurable goal for the next week.' }
      ]
    }
  }

  const speakingPrompt = focus === 'Speaking'
    ? `Speak naturally about ${topic}. State your main point, support it clearly, and give one specific example.`
    : `Summarize today's main idea about ${topic} in clear spoken English.`

  const reading = (focus === 'Reading' || focus === 'Mixed') ? buildReading(topic) : null
  const listening = (focus === 'Listening' || focus === 'Mixed') ? buildListening(topic) : null
  const speaking = buildSpeaking(topic)
  const vocabularyPractice = buildVocabPractice(vocabulary)

  return {
    day, week, phase, focus, title, objective, vocabulary, vocabularyPractice,
    tasks, reading, listening, speaking, speakingPrompt,
    checklist: ['I finished every timed task', 'I recorded mistakes in my error log', 'I reviewed today’s vocabulary']
  }
}

export const lessons = Array.from({ length: 112 }, (_, i) => lessonFor(i + 1))
export const courseResources = resources
