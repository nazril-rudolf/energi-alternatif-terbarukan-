
import Btn from './Btn'
import { setState, useStore } from '../state/store'
import { resetProgress } from '../utils/progress'
import { notify } from '../utils/notify'

export default function Settings() {
  const q = useStore((/** @type {{ quality: string }} */ s) => s.quality),
    vol = useStore((/** @type {{ volume: number }} */ s) => s.volume)

  return (
    <div className="card">
      <h2>Pengaturan</h2>
      <h3>Kualitas grafis</h3>
      <div className="row">{['low', 'medium', 'high'].map((/** @type {string} */ k) => <Btn key={k} label={k.toUpperCase()} active={q === k} onClick={() => { setState({ quality: k }); notify('Kualitas grafis: ' + k) }} />)}</div>
      <label className="sl">Volume narasi <output>{Math.round(vol * 100)}%</output><input type="range" min="0" max="1" step="0.1" value={vol} onChange={(/** @type {React.ChangeEvent<HTMLInputElement>} */ e) => setState({ volume: +e.target.value })} /></label>
      <h3>Tutorial singkat</h3>
      <ul><li>Geser untuk memutar, cubit atau scroll untuk zoom.</li><li>Klik objek untuk melihat informasinya.</li><li>Tekan START SIMULATION untuk melihat alur listrik.</li><li>Tekan EXPLODED VIEW atau X-RAY untuk melihat bagian dalam.</li></ul>
      <Btn label="MENU UTAMA" onClick={() => setState({ view: 'lab' })} /> <Btn label="HAPUS PROGRES" tone="red" onClick={() => { resetProgress(); setState({ visited: [], done: [], score: 0, bestQuiz: 0 }); notify('Progres dihapus') }} />
      <p className="note">Solar Energy Laboratory v1.0. Semua angka adalah simulasi edukatif, bukan pengukuran perangkat nyata. Jangan merangkai instalasi listrik sendiri.</p>
    </div>
  )
}
