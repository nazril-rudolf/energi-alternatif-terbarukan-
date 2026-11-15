
import { MISSIONS, level } from '../data/missions'
import { useStore } from '../state/store'

export default function Mission() {
  const done = useStore((/** @type {{ done: string[] }} */ s) => s.done),
    score = useStore((/** @type {{ score: number }} */ s) => s.score),
    vis = useStore((/** @type {{ visited: string[] }} */ s) => s.visited),
    best = useStore((/** @type {{ bestQuiz: number }} */ s) => s.bestQuiz)

  const badges = /** @type {[string, boolean][]} */ ([
    ['Penjelajah', vis.length >= 8],
    ['Ahli Energi', done.length === MISSIONS.length],
    ['Juara Kuis', best >= 9]
  ])

  return (
    <div className="card">
      <h2>Mode Misi</h2>
      <p>Level <b>{level(score)}</b> · Skor <b>{score}</b> · Selesai {done.length}/{MISSIONS.length}</p>
      <div className="chips">{badges.map(([n, ok]) => <span key={n} className={'chip' + (ok ? ' on' : '')}>{ok ? '🏅' : '🔒'} {n}</span>)}</div>
      {MISSIONS.map((/** @type {{ id: string, judul: string, petunjuk: string, target: string, poin: number, selesai: string }} */ m) => { const ok = done.includes(m.id); return (
        <div key={m.id} className={'mis' + (ok ? ' ok' : '')}><b>{ok ? '✔ ' : ''}{m.judul}</b><p>{m.petunjuk} Target: {m.target}. (+{m.poin})</p>{ok && <p className="pl">{m.selesai}</p>}</div>) })}
    </div>
  )
}
