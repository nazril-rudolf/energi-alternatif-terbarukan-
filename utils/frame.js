
import { getState } from '../state/store'

// Delta waktu untuk animasi 3D: nol ketika animasi dijeda.
/** @param {number} d */
export const dtOf = (d) => (getState().paused ? 0 : d)
