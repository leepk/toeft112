# TOEFL 112 — Browser-native Study App

React + Vite, mobile-first, client-only TOEFL study app.

## Run

```bash
npm install
npm run dev
```

## Architecture

- 112 lessons generated from `src/data/course.js`
- No backend required
- No embedded YouTube/video required for core learning
- Reading/Listening audio uses the browser Web Speech API
- Read-along text highlights while speech is playing (browser support varies slightly)
- Speaking/Vocabulary recording uses `MediaRecorder`
- Audio recordings are session-only and disappear after refresh
- Lesson progress and UI settings remain in `localStorage`
- Mobile and PC layouts use the same reusable components

## Shared components

- `ReadAlongPlayer` — Reading/Listening/model response, Play/Stop/speed/highlight
- `AudioRecorder` — temporary microphone recording + playback + optional speech-to-text
- `VocabularyPractice` — example sentence + listen + record for every word
- `SentencePractice` — listen/repeat/record shadowing
- `LessonContent` — renders data-driven Reading/Listening blocks
- `SpeakingPractice` — model response + sentence shadowing + full response

## Browser notes

Microphone access requires `localhost` or HTTPS. Speech voice and word-boundary highlighting depend on the browser/OS voice engine. Chrome desktop usually provides the most consistent boundary events; Safari/iOS may highlight at a less granular level depending on the selected system voice.

## Pronunciation module
- New `Pronounce` menu on desktop and mobile navigation.
- 32 data-driven lessons: sounds, minimal pairs, spelling patterns, word stress, rhythm, connected speech, and academic chunks.
- Each lesson includes recognition rule, mouth/tongue guidance, browser TTS examples, phrase read-along, temporary recording, speech-to-text sentence match score, and related TOEFL vocabulary derived from the 112-day course data.
- No audio/video assets are bundled; playback uses the browser Speech Synthesis API. Recordings are session-only and disappear on refresh.
