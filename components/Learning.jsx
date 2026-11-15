
import { useState } from 'react'
import { LEARNING } from '../data/learning'

/**
 * @typedef {
 *   | { t: 'p', v: string }
 *   | { t: 'ul', v: string[] }
 *   | { t: 'dl', v: Array<[string, string]> }
 * } LearningBlock
 */

export default function Learning() {
  const [i, setI] = useState(0), s = LEARNING[i]

  return (
    <div className="card">
      <h2>Materi Pembelajaran</h2>
      <div className="chips">
        {LEARNING.map((
          /** @type {{ id: string | number }} */ m,
          /** @type {number} */ k
        ) => (
          <button
            key={m.id}
            className={'chip' + (i === k ? ' on' : '')}
            onClick={() => setI(k)}
          >
            {m.id}
          </button>
        ))}
      </div>

      <h3>{s.judul}</h3>

      {s.blok.map((
        /** @type {LearningBlock} */ b,
        /** @type {number} */ k
      ) =>
        b.t === 'p' ? (
          <p key={k}>{b.v}</p>
        ) : b.t === 'ul' ? (
          <ul key={k}>
            {b.v.map((
              /** @type {string} */ x,
              /** @type {number} */ j
            ) => <li key={j}>{x}</li>)}
          </ul>
        ) : (
          <dl key={k}>
            {b.v.map((
              /** @type {[string, string]} */ pair
            ) => {
              const [a, c] = pair
              return (
                <div key={a}>
                  <dt>{a}</dt>
                  <dd>{c}</dd>
                </div>
              )
            })}
          </dl>
        )
      )}
    </div>
  )
}
