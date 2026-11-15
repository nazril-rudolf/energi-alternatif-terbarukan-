
import { setState } from '../state/store'

// Menampilkan notifikasi pada aplikasi.
/** @param {string} text */
export const notify = (text) =>
  setState({ toast: { text, n: Date.now() } })
