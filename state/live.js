// Data simulasi yang berubah setiap frame. Sengaja dibuat mutable agar objek 3D tidak perlu render ulang.
import { Vector3 } from 'three'
export const live = {
  hour: 11, light: 0.8, pv: 0, vPv: 0, iPv: 0, acLoad: 0, dcNeed: 0,
  batW: 0, soc: 60, vBat: 12.8, iBat: 0, status: 'siaga', served: false, short: false, cut: false,
}
export const anim = { explode: 0 }
export const sunPos = new Vector3(-10, 10, 6)
