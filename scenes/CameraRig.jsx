
import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { useStore } from '../state/store'
import { setView } from '../animations/camera'

// Kontrol kamera (mouse dan sentuhan) dengan perpindahan halus memakai GSAP.
export default function CameraRig() {
  const { camera } = useThree(), c = useRef()

  const req = useStore((/** @type {{ camReq: { pos: number[], look: number[] } | null }} */ s) => s.camReq)
  const zr = useStore((/** @type {{ zoomReq: { f: number } | null }} */ s) => s.zoomReq)
  const rot = useStore((/** @type {{ autoRotate: boolean }} */ s) => s.autoRotate)

  useEffect(() => {
    camera.position.set(34, 20, 36)
    const t = setTimeout(() => setView('front'), 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!req || !c.current) return

    gsap.to(camera.position, {
      x: req.pos[0],
      y: req.pos[1],
      z: req.pos[2],
      duration: 1.3,
      ease: 'power3.inOut'
    })

    gsap.to(c.current.target, {
      x: req.look[0],
      y: req.look[1],
      z: req.look[2],
      duration: 1.3,
      ease: 'power3.inOut',
      onUpdate: () => c.current && c.current.update()
    })
  }, [req])

  useEffect(() => {
    if (!zr || !c.current) return

    const t = c.current.target
    const o = camera.position.clone().sub(t)

    o.setLength(
      THREE.MathUtils.clamp(o.length() * zr.f, 3, 50)
    )

    gsap.to(camera.position, {
      x: t.x + o.x,
      y: t.y + o.y,
      z: t.z + o.z,
      duration: 0.5,
      ease: 'power2.out'
    })
  }, [zr])

  return (
    <OrbitControls
      ref={c}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      maxPolarAngle={Math.PI * 0.495}
      minDistance={2.5}
      maxDistance={55}
      autoRotate={rot}
      autoRotateSpeed={1.6}
      target={[2, 1.8, 0]}
    />
  )
}
