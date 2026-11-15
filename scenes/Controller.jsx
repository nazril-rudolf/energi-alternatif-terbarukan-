
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Part from './Part'
import Mat from './Mat'
import ScreenPlane from './ScreenPlane'
import useExplode from './useExplode'
import { drawController } from './screens'
import { live } from '../state/live'
import { getState } from '../state/store'

export default function Controller() {
  const r = useExplode()
  const leds = useRef(/** @type {(THREE.MeshStandardMaterial | null)[]} */ ([]))

  useFrame(() => {
    const p = getState().power

    const on = [
      live.batW > 0.5,
      live.status === 'menyalurkan' || (live.served && live.acLoad > 0),
      live.status === 'proteksi'
    ]

    leds.current.forEach((
      /** @type {THREE.MeshStandardMaterial | null} */ m,
      /** @type {number} */ i
    ) => {
      if (m) m.emissiveIntensity = p && on[i] ? 2.2 : 0
    })
  })

  return (
    <group position={[-3.4, 1.7, 1.2]}>
      <Part comp="controller" k="casing" refs={r} base={[0, 0, -0.2]} off={[0, 0, -0.4]} label="Casing belakang">
        <mesh castShadow>
          <boxGeometry args={[1.5, 1.6, 0.14]} />
          <Mat color="#2b3446" metal={0.6} />
        </mesh>
      </Part>

      <Part comp="controller" k="pcb" refs={r} base={[0, 0, -0.05]} off={[0, 0, 0.9]} label="Papan sirkuit (PCB)">
        <mesh>
          <boxGeometry args={[1.3, 1.4, 0.04]} />
          <Mat color="#0b7a4b" rough={0.6} />
        </mesh>

        {[[-0.3, 0.35], [0.3, 0.25], [0, -0.3]].map((
          /** @type {number[]} */ p,
          /** @type {number} */ i
        ) => (
          <mesh key={i} position={[p[0], p[1], 0.05]}>
            <boxGeometry args={[0.28, 0.2, 0.08]} />
            <Mat color="#111" />
          </mesh>
        ))}
      </Part>

      <Part comp="controller" k="penutup" refs={r} base={[0, 0, 0.1]} off={[0, 0, 1.8]} label="Penutup & layar">
        <mesh castShadow>
          <boxGeometry args={[1.5, 1.6, 0.12]} />
          <Mat color="#111827" metal={0.5} />
        </mesh>

        <ScreenPlane position={[0, 0.3, 0.07]} size={[1.1, 0.7]} draw={drawController} />

        {['#18e08a', '#4e9bff', '#ff4d5a'].map((
          /** @type {string} */ c,
          /** @type {number} */ i
        ) => (
          <mesh key={i} position={[-0.35 + i * 0.35, -0.3, 0.08]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial
              ref={(/** @type {THREE.MeshStandardMaterial | null} */ m) => {
                leds.current[i] = m
              }}
              color="#333"
              emissive={c}
              emissiveIntensity={0}
            />
          </mesh>
        ))}
      </Part>
    </group>
  )
}
