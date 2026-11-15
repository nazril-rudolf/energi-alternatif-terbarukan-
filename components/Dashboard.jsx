
import { useState } from 'react'
import {
  PanelTopClose,
  PanelTopOpen
} from 'lucide-react'

import { useStore } from '../state/store'
import { WEATHER } from '../simulations/energyModel'
import { SIM_STEPS } from '../animations/guidedSimulation'

/**
 * @param {number | null | undefined} v
 * @param {number} [d=0]
 * @returns {string}
 */
function f(v, d = 0) {
  return Number(v ?? 0).toFixed(d)
}

// Dashboard monitoring energi.
export default function Dashboard() {
  const [visible, setVisible] = useState(true)

  const L = useStore(
    (/** @type {{ snap: any }} */ s) => s.snap
  )

  const s = useStore(
    (/** @type {any} */ x) => x
  )

  const ok = !L
    ? ''
    : L.acLoad === 0
      ? 'Tidak ada beban'
      : L.served
        ? 'Energi mencukupi'
        : 'Energi TIDAK mencukupi'

  const jam = !L
    ? ''
    : s.mode === 'auto'
      ? `${String(Math.floor(L.hour)).padStart(2, '0')}:${String(Math.floor((L.hour % 1) * 60)).padStart(2, '0')}`
      : s.night
        ? 'Malam'
        : 'Siang'

  const step = L && s.running && SIM_STEPS[s.stage - 1]

  return (
    <div className="dashboard-wrap">

      <button
        className="dashboard-toggle glass"
        onClick={() => setVisible(/** @type {(v: boolean) => boolean} */ (v => !v))}
        aria-label={
          visible
            ? 'Tutup informasi Dashboard'
            : 'Buka informasi Dashboard'
        }
        aria-expanded={visible}
        title={
          visible
            ? 'Tutup informasi Dashboard'
            : 'Buka informasi Dashboard'
        }
      >
        {visible
          ? <PanelTopClose size={19} />
          : <PanelTopOpen size={19} />
        }
      </button>

      {visible && L && (
        <div className="dash glass">
          <div>
            <span>Panel surya</span>
            <b>{f(L.vPv, 1)} V · {f(L.iPv, 1)} A · {f(L.pv)} W</b>
          </div>

          <div>
            <span>Baterai</span>
            <b>{f(L.soc)}% · {f(L.vBat, 1)} V</b>
          </div>

          <div className={'bar' + (L.batW > 0.5 ? ' charge' : '')}>
            <i style={{ width: L.soc + '%' }} />
          </div>

          <div>
            <span>Arus · daya baterai</span>
            <b>{f(L.iBat, 1)} A · {f(L.batW)} W</b>
          </div>

          <div>
            <span>Status</span>
            <b>{L.status}</b>
          </div>

          <div>
            <span>Beban AC</span>
            <b>{f(L.acLoad)} W</b>
          </div>

          <div className={L.short ? 'bad' : 'good'}>
            <span>Kecukupan</span>
            <b>{ok}</b>
          </div>

          <div>
            <span>Cuaca · waktu</span>
            <b>{WEATHER[s.weather].nama} · {jam}</b>
          </div>

          {step && (
            <p className="step">
              <b>Tahap {s.stage}: {step.judul}.</b> {step.teks}
            </p>
          )}

          <small>
            Simulasi edukatif, bukan pengukuran perangkat nyata. Waktu dipercepat.
          </small>
        </div>
      )}

    </div>
  )
}
