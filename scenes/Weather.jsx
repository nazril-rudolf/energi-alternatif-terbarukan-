
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../state/store'
import { dtOf } from '../utils/frame'
import { QUALITY } from '../utils/quality'

const CLOUDS = [
  [-12, 13, -4],
  [-3, 14, -8],
  [7, 13, -5],
  [16, 14, -9],
  [-8, 12, 2]
]

const COUNT = {
  cerah: 0,
  berawan: 2,
  mendung: 5,
  hujan: 5
}

// Awan dan hujan mengikuti pilihan cuaca.
// Pengaruh ke daya listrik dihitung di energyModel.

export default function Weather() {
  const w = useStore(
    (/** @type {{ weather: 'cerah' | 'berawan' | 'mendung' | 'hujan' }} */ s) => s.weather
  )

  const n = QUALITY[
    useStore((/** @type {{ quality: string }} */ s) => s.quality)
  ].rain

  const refs = useRef(/** @type {(THREE.Group | null)[]} */ ([]))
  const rain = useRef(/** @type {THREE.Points | null} */ (null))
  const geo = useRef(/** @type {THREE.BufferGeometry | null} */ (null))

  const one = useMemo(() => new THREE.Vector3(), [])

  const pos = useMemo(() => {
    const a = new Float32Array(n * 3)

    for (let i = 0; i < n; i++) {
      a.set([
        Math.random() * 50 - 20,
        Math.random() * 16,
        Math.random() * 30 - 12
      ], i * 3)
    }

    return a
  }, [n])

  useFrame((
    /** @type {import('@react-three/fiber').RootState} */ _,
    /** @type {number} */ d
  ) => {
    const dt = dtOf(d)

    refs.current.forEach((
      /** @type {THREE.Group | null} */ g,
      /** @type {number} */ i
    ) => {
      if (!g) return

      const t = i < COUNT[w] ? 1 : 0.001

      one.set(t, t, t)
      g.scale.lerp(one, 0.05)

      g.position.x += dt * 0.3

      if (g.position.x > 26) {
        g.position.x = -26
      }
    })

    if (rain.current) {
      rain.current.visible = w === 'hujan'
    }

    if (w === 'hujan' && geo.current) {
      for (let i = 0; i < n; i++) {
        pos[i * 3 + 1] -= 14 * dt

        if (pos[i * 3 + 1] < 0) {
          pos[i * 3 + 1] = 16
        }
      }

      geo.current.attributes.position.needsUpdate = true
    }
  })

  const col =
    w === 'mendung' || w === 'hujan'
      ? '#5a6678'
      : '#d9e4f2'

  return (
    <>
      {CLOUDS.map((p, i) => (
        <group
          key={i}
          ref={(/** @type {THREE.Group | null} */ g) => {
            refs.current[i] = g
          }}
          position={p}
          scale={0.001}
        >
          {[
            [0, 0, 0, 2],
            [1.8, -0.2, 0.3, 1.6],
            [-1.8, -0.3, 0, 1.5]
          ].map((
            /** @type {[number, number, number, number]} */ s,
            /** @type {number} */ j
          ) => (
            <mesh
              key={j}
              position={[s[0], s[1], s[2]]}
            >
              <sphereGeometry args={[s[3], 16, 16]} />
              <meshStandardMaterial
                color={col}
                roughness={1}
              />
            </mesh>
          ))}
        </group>
      ))}

      <points ref={rain} frustumCulled={false}>
        <bufferGeometry ref={geo}>
          <bufferAttribute
            attach="attributes-position"
            count={n}
            array={pos}
            itemSize={3}
          />
        </bufferGeometry>

        <pointsMaterial
          color="#9ec8ff"
          size={0.12}
          transparent
          opacity={0.7}
        />
      </points>
    </>
  )
}
