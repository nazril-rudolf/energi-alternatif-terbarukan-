
// Seluruh aksi tombol dikumpulkan di sini supaya mudah diperbaiki dan dipakai ulang.
import { getState, setState } from '../state/store'
import { live } from '../state/live'
import { setExplode } from '../animations/explode'
import { setView } from '../animations/camera'
import { startGuided, stopGuided, pauseGuided } from '../animations/guidedSimulation'
import { notify } from '../utils/notify'
import { stopSpeak } from '../utils/speech'

export const actions = {
  powerOn: () => { setState({ power: true }); notify('Sistem aktif') },
  powerOff: () => { stopGuided(); setState({ power: false, running: false }); notify('Sistem mati: tidak ada aliran listrik') },
  start: () => { setState({ view: 'lab' }); startGuided(); notify('Simulasi dimulai') },
  pause: () => { setState({ paused: true }); pauseGuided(true); notify('Animasi dijeda') },
  resume: () => { setState({ paused: false }); pauseGuided(false); notify('Animasi dilanjutkan') },
  reset: () => {
    stopGuided(); stopSpeak(); setExplode(false)
    Object.assign(live, { hour: 11, soc: 60, cut: false })
    setState({ power: true, paused: false, mode: 'manual', night: false, sun: 80, weather: 'cerah', stage: 9, running: false,
      xray: false, autoRotate: false, selected: null, part: null, tourIdx: null, detail: false,
      loads: { lampu: true, kipas: false, tv: false, komputer: false, pompa: false } })
    setView('front'); notify('Semua objek dikembalikan ke posisi awal')
  },
  autoMode: () => { stopGuided(); live.hour = 6; setState({ mode: 'auto', power: true, running: false }); notify('Mode otomatis: satu hari berjalan sekitar 1,5 menit') },
  manualMode: () => { setState({ mode: 'manual' }); notify('Mode manual: atur intensitas dengan slider') },
  zoomIn: () => setState({ zoomReq: { f: 0.72, n: Math.random() } }),
  zoomOut: () => setState({ zoomReq: { f: 1.38, n: Math.random() } }),
  rotate: () => setState((/** @type {{ autoRotate: boolean }} */ s) => ({ autoRotate: !s.autoRotate })),
  explode: () => setExplode(!getState().exploded),
  xray: () => setState((/** @type {{ xray: boolean }} */ s) => ({ xray: !s.xray })),
  fullscreen: () => { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.() },
  day: () => { if (getState().mode === 'auto') live.hour = 12; setState({ night: false }); notify('Mode siang') },
  night: () => { if (getState().mode === 'auto') live.hour = 22; setState({ night: true }); notify('Mode malam: panel tidak menghasilkan listrik') },
}
