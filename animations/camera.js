
import { setState } from '../state/store'

// Titik fokus kamera untuk tiap objek (koordinat dunia) dan jarak pandang.

/** @type {Record<string, {look: [number, number, number], d: number}>} */
export const FOCUS = {
  matahari: { look: [-10, 10, 6], d: 12 },
  panel: { look: [-8, 2.6, -1.5], d: 10 },
  penyangga: { look: [-8, 1.6, -1], d: 10 },
  controller: { look: [-3.4, 1.7, 1.2], d: 5.5 },
  baterai: { look: [-0.6, 1.45, 1.2], d: 5.5 },
  inverter: { look: [2, 1.5, 1.2], d: 5.5 },
  distribusi: { look: [4.2, 1.6, 1.2], d: 5 },
  monitor: { look: [5.9, 1.3, 1.2], d: 4.5 },
  kabel_pos: { look: [-5, 1.7, 0.2], d: 8 },
  kabel_neg: { look: [-5, 1.7, 0.2], d: 8 },
  kabel_ac: { look: [6, 1.8, 1.2], d: 9 },
  rumah: { look: [13.2, 1.8, 0], d: 13 },
  lampu: { look: [13.2, 2.5, 0], d: 8 },
  kipas: { look: [15.4, 1.2, -0.3], d: 7 },
  tv: { look: [11.2, 1.3, -1.6], d: 7 },
  komputer: { look: [13.5, 0.9, -1.2], d: 7 },
  pompa: { look: [17.5, 0.6, 0.8], d: 7 },
}

/** @returns {boolean} */
const portrait = () => window.innerWidth < window.innerHeight

/**
 * Memfokuskan kamera ke objek tertentu.
 * @param {string} id
 */
export function focusOn(id) {
  const f = FOCUS[id] || FOCUS.panel
  const d = f.d * (portrait() ? 1.35 : 1)

  setState({
    camReq: {
      pos: [
        f.look[0] + d * 0.15,
        f.look[1] + d * 0.4,
        f.look[2] + d * 0.9
      ],
      look: f.look,
      n: Math.random()
    }
  })
}

/** @type {Record<string, [[number, number, number], [number, number, number]]>} */
const VIEWS = {
  front: [[3, 6, 26], [2, 1.8, 0]],
  back: [[3, 6, -26], [2, 1.8, 0]],
  top: [[2, 34, 0.1], [2, 0, 0]],
  side: [[30, 6, 2], [2, 1.8, 0]],
  iso: [[22, 16, 22], [2, 1.5, 0]],
  free: [[3, 6, 26], [2, 1.8, 0]],
}

/**
 * Mengubah sudut pandang kamera.
 * @param {string} k
 */
export function setView(k) {
  const [p, l] = VIEWS[k] || VIEWS.front
  const m = portrait() ? 1.5 : 1

  setState({
    camReq: {
      pos: p.map((v) => v * m),
      look: l,
      n: Math.random()
    }
  })
}
