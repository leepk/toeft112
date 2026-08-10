export function normalizeSpeechText(text = '') {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function tokenizeSpeech(text = '') {
  const normalized = normalizeSpeechText(text)
  return normalized ? normalized.split(' ') : []
}

// Word-level alignment using Levenshtein dynamic programming.
// This intentionally scores what browser speech recognition heard, not accent quality.
export function scoreSpeech(reference = '', transcript = '') {
  const expected = tokenizeSpeech(reference)
  const actual = tokenizeSpeech(transcript)
  const n = expected.length
  const m = actual.length

  if (!n) return emptyScore()

  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0))
  const op = Array.from({ length: n + 1 }, () => Array(m + 1).fill(null))

  for (let i = 1; i <= n; i++) { dp[i][0] = i; op[i][0] = 'delete' }
  for (let j = 1; j <= m; j++) { dp[0][j] = j; op[0][j] = 'insert' }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const same = expected[i - 1] === actual[j - 1]
      const choices = [
        { cost: dp[i - 1][j - 1] + (same ? 0 : 1), kind: same ? 'match' : 'replace' },
        { cost: dp[i - 1][j] + 1, kind: 'delete' },
        { cost: dp[i][j - 1] + 1, kind: 'insert' },
      ]
      choices.sort((a, b) => a.cost - b.cost || priority(a.kind) - priority(b.kind))
      dp[i][j] = choices[0].cost
      op[i][j] = choices[0].kind
    }
  }

  let i = n, j = m
  const referenceTokens = []
  const extraWords = []
  let matched = 0, missing = 0, replaced = 0

  while (i > 0 || j > 0) {
    const kind = op[i][j]
    if (kind === 'match') {
      referenceTokens.push({ word: expected[i - 1], status: 'match', heard: actual[j - 1] })
      matched++; i--; j--
    } else if (kind === 'replace') {
      referenceTokens.push({ word: expected[i - 1], status: 'wrong', heard: actual[j - 1] })
      replaced++; i--; j--
    } else if (kind === 'delete') {
      referenceTokens.push({ word: expected[i - 1], status: 'missing', heard: '' })
      missing++; i--
    } else if (kind === 'insert') {
      extraWords.push(actual[j - 1]); j--
    } else {
      // Empty-side fallback.
      if (i > 0) { referenceTokens.push({ word: expected[i - 1], status: 'missing', heard: '' }); missing++; i-- }
      else if (j > 0) { extraWords.push(actual[j - 1]); j-- }
    }
  }

  referenceTokens.reverse()
  extraWords.reverse()

  const accuracy = Math.max(0, Math.round((matched / n) * 100))
  const coverage = Math.max(0, Math.round(((matched + replaced) / n) * 100))
  const extraPenalty = Math.min(20, Math.round((extraWords.length / Math.max(1, n)) * 100))
  const score = Math.max(0, Math.round(accuracy - extraPenalty * 0.35))

  return {
    score,
    accuracy,
    coverage,
    matched,
    missing,
    replaced,
    extra: extraWords.length,
    extraWords,
    referenceTokens,
    expectedCount: n,
    actualCount: m,
    label: scoreLabel(score),
  }
}

export function scoreLabel(score) {
  if (score >= 95) return 'Excellent'
  if (score >= 85) return 'Very good'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Keep practicing'
  return 'Try again'
}

function priority(kind) {
  return ({ match: 0, replace: 1, delete: 2, insert: 3 })[kind] ?? 9
}

function emptyScore() {
  return { score: 0, accuracy: 0, coverage: 0, matched: 0, missing: 0, replaced: 0, extra: 0, extraWords: [], referenceTokens: [], expectedCount: 0, actualCount: 0, label: 'Try again' }
}
