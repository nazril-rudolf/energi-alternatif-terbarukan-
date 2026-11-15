import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Part from './Part'
import { live, sunPos } from '../state/live'
import { getState } from '../state/store'
import { dtOf } from '../utils/frame'
import { dotTexture } from '../utils/textures'

export default function Sun() {
  const g = useRef(), rays = useRef(), core = useRef(), glow = useRef()
  const tex = useRef(dotTexture())

  useFrame((
    /** @type {import('@react-three/fiber').RootState} */ _,
    /** @type {number} */ d
  ) => {
    const s = getState()

    if (s.mode === 'auto') {
      const t = THREE.MathUtils.clamp((live.hour - 6) / 12, -0.1, 1.1)
      sunPos.set(
        -14 + t * 28,
        3 + Math.sin(Math.PI * THREE.MathUtils.clamp(t, 0, 1)) * 9,
        6
      )
    } else {
      sunPos.set(-10, 10, 6)
    }

    g.current.position.copy(sunPos)
    g.current.visible = s.mode === 'auto'
      ? live.hour > 5 && live.hour < 19
      : !s.night

    rays.current.rotation.z += dtOf(d) * 0.3
    core.current.scale.setScalar(0.7 + 0.3 * live.light)
    glow.current.material.opacity = 0.25 + 0.75 * live.light
  })

  return (
    <group ref={g}>
      <Part comp="matahari" k="inti" label="Matahari">
        <mesh ref={core}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial color="#ffd54a" toneMapped={false} />
        </mesh>

        <group ref={rays}>
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2

            return (
              <mesh
                key={i}
                position={[Math.cos(a) * 2, Math.sin(a) * 2, 0]}
                rotation={[0, 0, a - Math.PI / 2]}
              >
                <boxGeometry args={[0.14, 1, 0.14]} />
                <meshBasicMaterial color="#ffb52e" toneMapped={false} />
              </mesh>
            )
          })}
        </group>

        <sprite ref={glow} scale={[11, 11, 1]}>
          <spriteMaterial
            map={tex.current}
            color="#ffc94a"
            blending={THREE.AdditiveBlending}
            transparent
            depthWrite={false}
          />
        </sprite>
      </Part>
    </group>
  )
}