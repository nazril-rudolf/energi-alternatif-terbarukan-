import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/app.css'
import { subscribe, getState } from './state/store'
import { saveProgress } from './utils/progress'

// Simpan progres belajar (misi, skor, komponen yang dibuka, nilai kuis) ke localStorage.
let last = ''
subscribe(() => {
  const s = getState()
  const p = { visited: s.visited, done: s.done, score: s.score, bestQuiz: s.bestQuiz }
  const k = JSON.stringify(p)
  if (k !== last) { last = k; saveProgress(p) }
})

createRoot(document.getElementById('root')).render(<App />)
