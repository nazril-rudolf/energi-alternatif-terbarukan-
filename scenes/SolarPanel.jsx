import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Part from './Part'
import Mat from './Mat'
import useExplode from './useExplode'
import { live } from '../state/live'
import { cellTexture, glareTexture } from '../utils/textures'

const W = 4.4, H = 2.8

// Panel surya berlapis: backsheet, EVA, sel, EVA, kaca, frame, dan junction box.
export default function SolarPanel() {
  const r = useExplode(), glare = useRef()
  const cell = useMemo(cellTexture, [])
  const gtex = useMemo(glareTexture, [])

  useFrame(({ clock }) => {
    glare.current.material.opacity = live.light * 0.55
    glare.current.position.x = Math.sin(clock.elapsedTime * 0.7) * 1.8
  })

  const al = '#c3cbd6'

  return (
    <group position={[-8, 2.6, -1.5]}>
      <group rotation={[-0.9, 0, 0]}>
        <Part comp="panel" k="backsheet" refs={r} base={[0, 0, -0.16]} off={[0, 0, -1.2]} label="Backsheet">
          <mesh castShadow>
            <boxGeometry args={[W, H, 0.04]} />
            <Mat color="#e8edf5" rough={0.8} />
          </mesh>
        </Part>

        <Part comp="panel" k="eva" refs={r} base={[0, 0, -0.08]} off={[0, 0, -0.6]}>
          <mesh>
            <boxGeometry args={[W - 0.1, H - 0.1, 0.03]} />
            <Mat color="#f3d98a" opacity={0.6} />
          </mesh>
        </Part>

        <Part comp="panel" k="sel" refs={r} label="Sel surya (silikon)">
          <mesh>
            <planeGeometry args={[W - 0.12, H - 0.12]} />
            <meshStandardMaterial map={cell} metalness={0.7} roughness={0.25} side={THREE.DoubleSide} />
          </mesh>
        </Part>

        <Part comp="panel" k="eva" refs={r} base={[0, 0, 0.08]} off={[0, 0, 0.6]} label="Lapisan EVA">
          <mesh>
            <boxGeometry args={[W - 0.1, H - 0.1, 0.03]} />
            <Mat color="#f3d98a" opacity={0.45} />
          </mesh>
        </Part>

        <Part comp="panel" k="kaca" refs={r} base={[0, 0, 0.17]} off={[0, 0, 1.3]} label="Kaca pelindung">
          <mesh>
            <boxGeometry args={[W, H, 0.05]} />
            <Mat color="#aed6ff" metal={0.9} rough={0.04} opacity={0.22} />
          </mesh>
          <mesh ref={glare} position={[0, 0, 0.04]} rotation={[0, 0, 0.3]}>
            <planeGeometry args={[1, H * 0.95]} />
            <meshBasicMaterial map={gtex} transparent blending={THREE.AdditiveBlending} depthWrite={false} opacity={0} />
          </mesh>
        </Part>

        <Part comp="panel" k="frame" refs={r} label="Frame aluminium">
          {[[0, H / 2, W + 0.14, 0.14], [0, -H / 2, W + 0.14, 0.14], [-W / 2, 0, 0.14, H], [W / 2, 0, 0.14, H]].map((f, i) => (
            <mesh key={i} position={[f[0], f[1], 0]} castShadow>
              <boxGeometry args={[f[2], f[3], 0.22]} />
              <Mat color={al} metal={0.9} rough={0.3} />
            </mesh>
          ))}
        </Part>

        <Part comp="panel" k="junction" refs={r} base={[1.6, -1, -0.3]} off={[0, 0, -1.9]} label="Junction box">
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.3, 0.18]} />
            <Mat color="#1a1f2b" />
          </mesh>
        </Part>
      </group>

      {/* Tiang dan struktur penyangga */}
      <Part comp="penyangga" k="rangka" label="Tiang penyangga">
        {[[-1.6, -1.735, 1.1, 1.73], [1.6, -1.735, 1.1, 1.73], [-1.6, -0.865, -1.1, 3.5], [1.6, -0.865, -1.1, 3.5]].map((p, i) => (
          <mesh key={i} position={[p[0], p[1], p[2]]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, p[3], 12]} />
            <Mat color="#7c8aa8" metal={0.8} rough={0.4} />
          </mesh>
        ))}
        <mesh position={[0, -2.4, 0]} castShadow>
          <boxGeometry args={[3.4, 0.08, 0.08]} />
          <Mat color="#7c8aa8" metal={0.8} />
        </mesh>
      </Part>
    </group>
  )
}