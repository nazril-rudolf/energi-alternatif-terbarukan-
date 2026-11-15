
import { ChevronLeft, ChevronRight, Volume2, VolumeX, X } from 'lucide-react'
import Btn from './Btn'
import { TOUR } from '../data/tour'
import { focusOn } from '../animations/camera'
import { setState, useStore } from '../state/store'
import { canSpeak, speak, stopSpeak } from '../utils/speech'

// Tur laboratorium: kamera berpindah otomatis, narasi suara bersifat opsional.
export default function Tour() {
  const i = useStore((/** @type {{ tourIdx: number | null }} */ s) => s.tourIdx),
    voice = useStore((/** @type {{ voice: boolean }} */ s) => s.voice),
    vol = useStore((/** @type {{ volume: number }} */ s) => s.volume)

  const go = (/** @type {number} */ n) => {
    const t = TOUR[n]
    setState({ tourIdx: n, selected: t.id })
    focusOn(t.id)
    if (getVoice()) speak(`${t.judul}. ${t.teks}`, vol)
  }

  const getVoice = () => voice

  if (i === null) return <div className="card"><h2>Tur Laboratorium</h2><p>Kamera akan mengunjungi matahari, panel, controller, baterai, inverter, dan peralatan elektronik.</p><Btn label="MULAI TUR" onClick={() => go(0)} /></div>

  const t = TOUR[i]

  return (
    <div className="card holo">
      <h2>{i + 1}/{TOUR.length} · {t.judul}</h2><p>{t.teks}</p>
      <div className="row">
        <Btn label="KEMBALI" icon={ChevronLeft} disabled={i === 0} onClick={() => go(i - 1)} />
        <Btn label={i === TOUR.length - 1 ? 'SELESAI' : 'LANJUT'} icon={ChevronRight} onClick={() => i === TOUR.length - 1 ? (stopSpeak(), setState({ tourIdx: null })) : go(i + 1)} />
        <Btn label={voice ? 'SUARA ON' : 'SUARA OFF'} icon={voice ? Volume2 : VolumeX} active={voice} disabled={!canSpeak()} onClick={() => { setState({ voice: !voice }); if (voice) stopSpeak(); else speak(`${t.judul}. ${t.teks}`, vol) }} />
        <Btn label="TUTUP" icon={X} tone="red" onClick={() => { stopSpeak(); setState({ tourIdx: null }) }} />
      </div>
    </div>
  )
}
