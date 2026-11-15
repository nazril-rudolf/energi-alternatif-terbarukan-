
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Part from './Part'
import Mat from './Mat'
import { live } from '../state/live'
import { getState } from '../state/store'
import { dtOf } from '../utils/frame'

const lerp = THREE.MathUtils.lerp

/** @param {string} k */
const act = (k) => getState().loads[k] && live.served

export function Lamp() {
  const m = useRef(/** @type {THREE.MeshStandardMaterial | null} */ (null))
  const pl = useRef(/** @type {THREE.PointLight | null} */ (null))

  useFrame(() => {
    const on = act('lampu')
    if (!m.current || !pl.current) return

    m.current.emissiveIntensity = lerp(m.current.emissiveIntensity, on ? 2.6 : 0, 0.12)
    pl.current.intensity = lerp(pl.current.intensity, on ? 6 : 0, 0.12)
  })

  return (
    <Part comp="lampu" k="badan" label="Lampu LED">
      <mesh position={[0, 3.25, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
        <Mat color="#222" />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial ref={m} color="#fff" emissive="#ffd45a" emissiveIntensity={0} transparent opacity={0.85} />
      </mesh>
      <pointLight ref={pl} position={[0, 2.7, 0]} color="#ffe39a" intensity={0} distance={9} />
    </Part>
  )
}

export function Fan() {
  const bl = useRef(/** @type {THREE.Group | null} */ (null))
  const sp = useRef(0)

  useFrame((/** @type {THREE.RootState} */ _, /** @type {number} */ d) => {
    sp.current = lerp(sp.current, act('kipas') ? 12 : 0, Math.min(1, d * 2.5))
    if (bl.current) bl.current.rotation.z -= sp.current * dtOf(d)
  })

  return (
    <Part comp="kipas" k="badan" label="Kipas angin">
      <group position={[2.2, 0, -0.5]}>
        <mesh position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.6, 0.14, 20]} />
          <Mat color="#9aa6bd" metal={0.8} />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.4, 10]} />
          <Mat color="#9aa6bd" metal={0.8} />
        </mesh>
        <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.45, 16]} />
          <Mat color="#2b3446" metal={0.6} />
        </mesh>
        <group ref={bl} position={[0, 1.8, 0.35]}>
          {[0, 1, 2, 3].map((/** @type {number} */ i) => (
            <group key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
              <mesh position={[0, 0.45, 0]}>
                <boxGeometry args={[0.2, 0.7, 0.03]} />
                <Mat color="#2d8cff" />
              </mesh>
            </group>
          ))}
        </group>
        <mesh position={[0, 1.8, 0.5]}>
          <torusGeometry args={[0.8, 0.025, 8, 32]} />
          <Mat color="#cfd8e6" metal={0.9} />
        </mesh>
      </group>
    </Part>
  )
}

export function Television() {
  const m = useRef(/** @type {THREE.MeshStandardMaterial | null} */ (null))

  useFrame((/** @type {THREE.RootState} */ { clock }) => {
    if (!m.current) return

    const on = act('tv')
    m.current.emissiveIntensity = lerp(m.current.emissiveIntensity, on ? 1.4 : 0, 0.1)
    m.current.emissive.setHSL((clock.elapsedTime * 0.1) % 1, 0.8, 0.5)
  })

  return (
    <Part comp="tv" k="badan" label="Televisi">
      <group position={[-2, 0, -1.55]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.9, 0.7, 0.6]} />
          <Mat color="#6b4a2f" />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.6, 0.9, 0.1]} />
          <Mat color="#111" />
        </mesh>
        <mesh position={[0, 1.2, 0.06]}>
          <planeGeometry args={[1.5, 0.8]} />
          <meshStandardMaterial ref={m} color="#0a0f18" emissive="#2d8cff" emissiveIntensity={0} />
        </mesh>
      </group>
    </Part>
  )
}

export function Computer() {
  const m = useRef(/** @type {THREE.MeshStandardMaterial | null} */ (null))

  useFrame(() => {
    if (!m.current) return
    m.current.emissiveIntensity = lerp(m.current.emissiveIntensity, act('komputer') ? 1.3 : 0, 0.1)
  })

  return (
    <Part comp="komputer" k="badan" label="Komputer">
      <group position={[0.3, 0, -1.2]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[1.6, 0.08, 0.8]} />
          <Mat color="#6b4a2f" />
        </mesh>
        {[-0.7, 0.7].map((/** @type {number} */ x) => (
          <mesh key={x} position={[x, 0.35, 0]}>
            <boxGeometry args={[0.06, 0.7, 0.7]} />
            <Mat color="#4a3320" />
          </mesh>
        ))}
        <mesh position={[0, 1.15, -0.1]} castShadow>
          <boxGeometry args={[0.8, 0.5, 0.05]} />
          <Mat color="#111" />
        </mesh>
        <mesh position={[0, 1.15, -0.07]}>
          <planeGeometry args={[0.72, 0.42]} />
          <meshStandardMaterial ref={m} color="#0a0f18" emissive="#8fd0ff" emissiveIntensity={0} />
        </mesh>
        <mesh position={[0.55, 0.92, 0]}>
          <boxGeometry args={[0.3, 0.45, 0.5]} />
          <Mat color="#222a3b" />
        </mesh>
      </group>
    </Part>
  )
}

export function Pump() {
  const g = useRef(/** @type {THREE.Group | null} */ (null))
  const balls = useRef(/** @type {(THREE.Mesh | null)[]} */ ([]))

  useFrame((/** @type {THREE.RootState} */ { clock }) => {
    const on = act('pompa')
    const t = clock.elapsedTime

    if (g.current) {
      g.current.position.y = on ? Math.sin(t * 60) * 0.008 : 0
    }

    balls.current.forEach((/** @type {THREE.Mesh | null} */ b, /** @type {number} */ i) => {
      if (!b) return
      b.visible = on
      b.position.y = 0.55 + ((t * 0.8 + i / 3) % 1) * 1.2
    })
  })

  return (
    <Part comp="pompa" k="badan" label="Pompa air">
      <group position={[4.3, 0, 0.8]}>
        <group ref={g}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.8, 20]} />
            <Mat color="#2563eb" metal={0.4} />
          </mesh>
          <mesh position={[0.55, 0.4, 0]} castShadow>
            <boxGeometry args={[0.6, 0.5, 0.5]} />
            <Mat color="#1d2a4a" metal={0.5} />
          </mesh>
        </group>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1.4, 10]} />
          <Mat color="#9aa6bd" opacity={0.7} />
        </mesh>
        {[0, 1, 2].map((/** @type {number} */ i) => (
          <mesh
            key={i}
            ref={(/** @type {THREE.Mesh | null} */ b) => {
              balls.current[i] = b
            }}
            position={[0, 0.8, 0]}
          >
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color="#38b6ff" />
          </mesh>
        ))}
      </group>
    </Part>
  )
}
