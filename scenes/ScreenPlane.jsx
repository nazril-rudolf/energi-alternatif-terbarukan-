import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { live } from '../state/live'
import { getState } from '../state/store'

// Layar digital kecil: kanvas 2D diperbarui 4 kali per detik.
export default function ScreenPlane({ size = [1, 0.6], px = [256, 160], draw, position }) {
  const { canvas, tex } = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = px[0]
    c.height = px[1]

    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace

    return { canvas: c, tex: t }
  }, [])

  const acc = useRef(1)

  useFrame((
    /** @type {import('@react-three/fiber').RootState} */ _,
    /** @type {number} */ d
  ) => {
    acc.current += d
    if (acc.current < 0.25) return

    acc.current = 0
    draw(canvas.getContext('2d'), px[0], px[1], live, getState())
    tex.needsUpdate = true
  })

  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  )
}