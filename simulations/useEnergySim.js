
import { useEffect } from 'react'
import { getState, setState } from '../state/store'
import { live } from '../state/live'
import { stepEnergy } from './energyModel'

// Menjalankan model energi terus-menerus. Dashboard diperbarui 4 kali per detik.
export default function useEnergySim() {
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let acc = 0

    const loop = (/** @type {number} */ t) => {
      raf = requestAnimationFrame(loop)

      const dt = Math.min((t - last) / 1000, 0.1)
      last = t

      const s = getState()

      if (!s.paused) {
        stepEnergy(live, s, dt)
      }

      acc += dt

      if (acc > 0.25) {
        acc = 0
        setState({ snap: { ...live } })
      }
    }

    raf = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(raf)
  }, [])
}
