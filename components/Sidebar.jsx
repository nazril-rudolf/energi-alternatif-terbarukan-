
import {
  FlaskConical,
  Target,
  Route,
  ListChecks,
  BookOpen,
  Settings
} from 'lucide-react'

import { setState, useStore } from '../state/store'

const ITEMS = [
  ['lab', 'Lab', FlaskConical],
  ['misi', 'Misi', Target],
  ['tur', 'Tur', Route],
  ['kuis', 'Kuis', ListChecks],
  ['materi', 'Materi', BookOpen],
  ['set', 'Atur', Settings]
]

export default function Sidebar() {
  const v = useStore(
    (/** @type {{ view: string }} */ s) => s.view
  )

  return (
    <nav className="nav" aria-label="Menu utama">
      <div className="brand">
        ☀
        <small>SOLAR LAB</small>
      </div>

      {ITEMS.map(([k, l, I]) => (
        <button
          key={k}
          className={v === k ? 'on' : ''}
          onClick={() =>
            setState({
              view: k,
              panelOpen: true
            })
          }
        >
          <I size={20} />
          <span>{l}</span>
        </button>
      ))}
    </nav>
  )
}
