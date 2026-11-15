
import { useEffect, useState } from 'react'
import Btn from './Btn'
import { QUIZ } from '../data/quiz'
import { getState, setState } from '../state/store'

const TIME = 20

export default function Quiz() {
  const [i, setI] = useState(0), [pick, setPick] = useState(null), [score, setScore] = useState(0), [t, setT] = useState(TIME)
  const done = i >= QUIZ.length, q = QUIZ[i]

  useEffect(() => {
    if (done || pick !== null) return
    const id = setInterval(() => setT((/** @type {number} */ v) => v - 1), 1000)
    return () => clearInterval(id)
  }, [i, pick, done])

  useEffect(() => { if (t <= 0 && pick === null && !done) setPick(-1) }, [t, pick, done])

  useEffect(() => { if (done) setState({ bestQuiz: Math.max(getState().bestQuiz, score) }) }, [done])

  const answer = (/** @type {number} */ k) => { if (pick !== null) return; setPick(k); if (k === q[2]) setScore((/** @type {number} */ v) => v + 1) }
  const next = () => { setI(i + 1); setPick(null); setT(TIME) }
  const again = () => { setI(0); setPick(null); setScore(0); setT(TIME) }

  if (done) return <div className="card"><h2>Hasil Kuis</h2><p className="big">{score * 10}</p><p>Benar {score} dari {QUIZ.length} soal. Nilai terbaik: {Math.max(getState().bestQuiz, score) * 10}.</p><Btn label="ULANGI KUIS" onClick={again} /></div>

  return (
    <div className="card">
      <h2>Kuis {i + 1}/{QUIZ.length} <small className={t <= 5 ? 'bad' : ''}>⏱ {Math.max(t, 0)} dtk</small></h2>
      <p className="q">{q[0]}</p>
      {q[1].map((/** @type {string} */ o, /** @type {number} */ k) => <button key={k} className={'opt' + (pick !== null ? (k === q[2] ? ' ok' : k === pick ? ' bad' : '') : '')} onClick={() => answer(k)}>{'ABCD'[k]}. {o}</button>)}
      {pick !== null && <><p>{pick === q[2] ? 'Benar! ' : pick === -1 ? 'Waktu habis. ' : 'Kurang tepat. '}{q[3]}</p><Btn label={i === QUIZ.length - 1 ? 'LIHAT NILAI' : 'SOAL BERIKUTNYA'} onClick={next} /></>}
    </div>
  )
}
