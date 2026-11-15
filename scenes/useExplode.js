import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { anim } from '../state/live'
// Menggerakkan semua <Part> yang terdaftar dari posisi awal ke posisi bongkar sesuai anim.explode (0..1).
export default function useExplode() {
  const refs = useRef({})
  useFrame(() => {
    const e = anim.explode
    for (const k in refs.current) {
      const o = refs.current[k]
      if (!o || !o.userData.base) continue
      const b = o.userData.base, f = o.userData.off
      o.position.set(b[0] + f[0] * e, b[1] + f[1] * e, b[2] + f[2] * e)
    }
  })
  return refs
}
