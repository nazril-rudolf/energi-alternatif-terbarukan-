
import { LOADS } from '../simulations/energyModel'
import { setState, useStore } from '../state/store'
import Btn from './Btn'

// Tombol ON/OFF peralatan rumah dan total konsumsi daya.
export default function ApplianceControls() {
  const loads = useStore(
    (/** @type {{ loads: Record<string, boolean> }} */ s) => s.loads
  )

  const L = useStore(
    (/** @type {{ snap: { served: boolean } | null }} */ s) => s.snap
  )

  const total = Object.keys(LOADS).reduce(
    (a, k) => a + (loads[k] ? LOADS[k].w : 0),
    0
  )

  return (
    <div className="card">
      <h3>Peralatan rumah</h3>

      {Object.keys(LOADS).map((k) => (
        <div className="app-row" key={k}>
          <span>
            {LOADS[k].nama} <small>{LOADS[k].w} W</small>
          </span>

          <Btn
            label={loads[k] ? 'ON' : 'OFF'}
            active={loads[k]}
            onClick={() =>
              setState({ loads: { ...loads, [k]: !loads[k] } })
            }
          />
        </div>
      ))}

      <p>
        Permintaan: <b>{total} W</b>.{' '}
        {L && total > 0
          ? L.served
            ? 'Energi tersedia.'
            : 'Energi belum mencukupi.'
          : ''}
      </p>
    </div>
  )
}
