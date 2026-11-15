import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../state/store'
import { FOCUS } from '../animations/camera'

// Cincin berdenyut di lantai pada objek yang dipilih.
export default function SelectRing() {
  const id = useStore(
    (/** @type {{ selected: string | null }} */ s) => s.selected
  )

  const ref = useRef(null)
  const f = id && FOCUS[id]

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.opacity =
        0.5 + 0.4 * Math.sin(clock.elapsedTime * 4)
    }
  })

  if (!f || id === 'matahari') return null

  const r = Math.min(f.d * 0.14, 1.6)

  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[f.look[0], 0.06, f.look[2]]}
    >
      <ringGeometry args={[r, r + 0.12, 48]} />
      <meshBasicMaterial color="#2ee6a6" transparent />
    </mesh>
  )
}