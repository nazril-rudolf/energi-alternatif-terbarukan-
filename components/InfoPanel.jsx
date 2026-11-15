
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Btn from './Btn'
import ExplodeBar from './ExplodeBar'
import ApplianceControls from './ApplianceControls'
import { INFO, PARTS } from '../data/components'
import { setExplode } from '../animations/explode'
import { focusOn } from '../animations/camera'
import { actions } from '../controls/actions'
import { setState, useStore } from '../state/store'

const Row = ({ t, v, c }) => v ? <div className={'rw ' + (c || '')}><b>{t}</b>{v}</div> : null

// Panel informasi hologram untuk objek atau bagian yang dipilih.
export default function InfoPanel() {
  const sel = useStore((/** @type {{ selected: string | null }} */ s) => s.selected),
    part = useStore((/** @type {{ part: string | null }} */ s) => s.part),
    detail = useStore((/** @type {{ detail: boolean }} */ s) => s.detail),
    rot = useStore((/** @type {{ autoRotate: boolean }} */ s) => s.autoRotate)

  const ref = useRef(), d = sel && INFO[sel], p = sel && part && PARTS[sel]?.[part], parts = sel && PARTS[sel]

  useEffect(() => {
    if (ref.current) gsap.fromTo(ref.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 })
  }, [sel, part])

  return (
    <>
      {!d && <div className="card"><h2>Laboratorium Energi Surya</h2><p>Klik atau sentuh objek 3D untuk melihat penjelasannya. Gunakan EXPLODED VIEW dan X-RAY untuk melihat bagian dalam.</p>
        <p className="leg"><span style={{ color: '#ffd84a' }}>● Kuning</span> cahaya · <span style={{ color: '#38b6ff' }}>● Biru</span> DC · <span style={{ color: '#37ff8b' }}>● Hijau</span> AC · <span style={{ color: '#ff4d5a' }}>● Merah</span> kabel (+) · <span>● Hitam</span> kabel (−)</p></div>}
      {d && (
        <div className="card holo" ref={ref}>
          <h2>{(p ? p.nama + ' · ' : '') + d.nama}</h2>
          {p ? <><Row t="Fungsi" v={p.fungsi} /><Row t="Material" v={p.bahan} /></> :
            <><Row t="Fungsi" v={d.fungsi} /><Row t="Cara kerja" v={d.cara} /><Row t="Bahan / bagian" v={d.bahan} />
              {detail && <><Row t="Peran dalam sistem" v={d.peran} /><Row t="Manfaat" v={d.plus} c="pl" /><Row t="Keterbatasan" v={d.minus} c="mn" /></>}</>}
          {parts && <div className="chips">{Object.keys(parts).map((k) => <button key={k} className={'chip' + (part === k ? ' on' : '')} onClick={() => setState({ part: k })}>{parts[k].nama}</button>)}</div>}
          <div className="row">
            <Btn label="INFO LENGKAP" active={detail} onClick={() => setState({ detail: !detail })} />
            <Btn label="LIHAT BAGIAN DALAM" tone="violet" onClick={() => { setExplode(true); setTimeout(() => focusOn(sel), 400) }} />
            <Btn label="PUTAR OBJEK" active={rot} onClick={actions.rotate} />
            <Btn label="TUTUP INFORMASI" tone="red" onClick={() => setState({ selected: null, part: null })} />
          </div>
        </div>)}
      <div className="card"><h3>Bongkar komponen</h3><ExplodeBar /></div>
      <ApplianceControls />
    </>
  )
}
