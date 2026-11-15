
import gsap from 'gsap'
import { getState, setState } from '../state/store'
import { focusOn } from './camera'
import { notify } from '../utils/notify'

/** @type {{judul: string, teks: string, focus: string}[]} */
export const SIM_STEPS = [
  { judul: 'Matahari memancarkan cahaya', teks: 'Cahaya (partikel kuning) bergerak dari matahari menuju panel surya.', focus: 'matahari' },
  { judul: 'Cahaya mengenai panel surya', teks: 'Panel surya menerima cahaya matahari.', focus: 'panel' },
  { judul: 'Sel fotovoltaik menghasilkan listrik DC', teks: 'Foton melepas elektron di sel silikon sehingga timbul listrik arus searah (DC).', focus: 'panel' },
  { judul: 'Listrik DC mengalir lewat kabel', teks: 'Partikel biru melambangkan aliran energi listrik DC lewat kabel merah (+) dan hitam (−) menuju controller.', focus: 'kabel_pos' },
  { judul: 'Controller mengatur pengisian baterai', teks: 'Solar Charge Controller menjaga baterai agar tidak kelebihan isi. Fungsinya berbeda dengan inverter.', focus: 'controller' },
  { judul: 'Baterai menyimpan energi', teks: 'Energi listrik disimpan sebagai energi kimia di dalam baterai.', focus: 'baterai' },
  { judul: 'Inverter mengubah DC menjadi AC', teks: 'Inverter mengubah listrik DC dari baterai menjadi AC agar dapat dipakai peralatan rumah.', focus: 'inverter' },
  { judul: 'Listrik AC menuju peralatan', teks: 'Partikel hijau melambangkan listrik AC yang dialirkan lewat kotak distribusi ke rumah.', focus: 'distribusi' },
  { judul: 'Lampu menyala dan kipas berputar', teks: 'Peralatan bekerja memakai energi listrik. Perhatikan daya dan baterai pada dashboard.', focus: 'rumah' },
]

const GAP = 5.5

/** @type {gsap.core.Timeline | null} */
let tl = null

export function startGuided() {
  stopGuided()

  const s = getState()

  setState({
    power: true,
    night: false,
    mode: 'manual',
    running: true,
    stage: 0,
    paused: false,
    sun: Math.max(s.sun, 70),
    weather: s.weather === 'hujan' ? 'cerah' : s.weather,
    loads: { ...s.loads, lampu: true, kipas: true }
  })

  tl = gsap.timeline()

  SIM_STEPS.forEach((st, i) => {
    tl.call(() => {
    setState((/** @type {{ stageMax: number }} */ state) => ({
  stage: i + 1,
  stageMax: Math.max(state.stageMax, i + 1)
}))

      focusOn(st.focus)
    }, null, i * GAP)
  })

  tl.call(() => {
    setState({ running: false })
    notify('Simulasi selesai: sistem bekerja penuh')
  }, null, SIM_STEPS.length * GAP)
}

export function stopGuided() {
  if (tl) {
    tl.kill()
    tl = null
  }

  if (getState().stage < 9) {
    setState({ stage: 9, running: false })
  }
}

/**
 * Menjeda atau melanjutkan simulasi terpandu.
 * @param {boolean} p
 */
export const pauseGuided = (p) => {
  if (tl) {
    tl.paused(p)
  }
}
