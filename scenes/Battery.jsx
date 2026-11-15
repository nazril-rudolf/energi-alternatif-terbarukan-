
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Part from './Part'
import Mat from './Mat'
import useExplode from './useExplode'
import { live } from '../state/live'
import { getState } from '../state/store'

export default function Battery() {
  const r = useExplode()
  const bars = useRef(/** @type {(THREE.MeshStandardMaterial | null)[]} */ ([]))

  useFrame(() => {
    const n = Math.round(live.soc / 20)
    const c = live.soc > 50 ? '#2ee6a6' : live.soc > 20 ? '#ffc83d' : '#ff4d5a'
    const p = getState().power

    bars.current.forEach((/** @type {THREE.MeshStandardMaterial | null} */ m, /** @type {number} */ i) => {
      if (!m) return

      const on = i < n && p
      m.emissive.set(on ? c : '#000')
      m.emissiveIntensity = on ? 1.6 : 0
      m.color.set(i < n ? c : '#222')
    })
  })

  return (
    <group position={[-0.6, 1.45, 1.2]}>
      <Part comp="baterai" k="casing" refs={r} label="Casing baterai">
        <mesh castShadow>
          <boxGeometry args={[1.7, 1.1, 0.9]} />
          <Mat color="#1e4fa8" opacity={0.38} rough={0.2} />
        </mesh>
      </Part>

      <Part comp="baterai" k="sel" refs={r} off={[0, 0.9, 0]} label="Sel baterai">
        {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} castShadow>
            <cylinderGeometry args={[0.17, 0.17, 0.85, 20]} />
            <Mat color={i % 2 ? '#2ee6a6' : '#2d8cff'} metal={0.6} rough={0.3} />
          </mesh>
        ))}
      </Part>

      <Part comp="baterai" k="kutub" refs={r} base={[0, 0.62, 0]} off={[0, 1.9, 0]} label="Tutup & kutub (+/−)">
        <mesh>
          <boxGeometry args={[1.7, 0.12, 0.9]} />
          <Mat color="#0f1a33" metal={0.5} />
        </mesh>
        <mesh position={[-0.5, 0.12, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.14, 16]} />
          <Mat color="#e5242a" />
        </mesh>
        <mesh position={[0.5, 0.12, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.14, 16]} />
          <Mat color="#15181d" />
        </mesh>
      </Part>

      <Part comp="baterai" k="indikator" refs={r} base={[0, 0, 0.47]} off={[0, 0, 1.2]} label="Indikator kapasitas">
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[-0.5 + i * 0.25, 0, 0]}>
            <boxGeometry args={[0.2, 0.45, 0.04]} />
            <meshStandardMaterial
              ref={(/** @type {THREE.MeshStandardMaterial | null} */ m) => {
                bars.current[i] = m
              }}
              color="#222"
              emissive="#000"
            />
          </mesh>
        ))}
      </Part>
    </group>
  )
}
