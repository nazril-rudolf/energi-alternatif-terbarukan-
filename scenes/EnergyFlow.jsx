
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WIRES } from './paths'
import { live, sunPos } from '../state/live'
import { getState } from '../state/store'
import { dtOf } from '../utils/frame'
import { dotTexture } from '../utils/textures'

// Partikel bercahaya sebagai LAMBANG aliran energi (bukan kecepatan elektron sebenarnya).

/**
 * @typedef {Object} FlowProps
 * @property {(u: number, o: THREE.Vector3) => THREE.Vector3} get
 * @property {() => boolean} active
 * @property {string} color
 * @property {number} [n]
 * @property {number} [size]
 * @property {number} [dir]
 * @property {number} [speed]
 */

/** @param {FlowProps} props */
function Flow({ get, active, color, n = 14, size = 0.28, dir = 1, speed = 0.3 }) {
  const geo = useRef(/** @type {THREE.BufferGeometry | null} */ (null))
  const mat = useRef(/** @type {THREE.PointsMaterial | null} */ (null))
  const t = useRef(Math.random())

  const pos = useMemo(() => new Float32Array(n * 3), [n])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const tex = useMemo(() => dotTexture(), [])

  useFrame((
    /** @type {import('@react-three/fiber').RootState} */ _,
    /** @type {number} */ d
  ) => {
    if (!mat.current) return

    mat.current.opacity = THREE.MathUtils.lerp(
      mat.current.opacity,
      active() ? 1 : 0,
      0.12
    )

    if (mat.current.opacity < 0.02) return

    t.current += dtOf(d) * speed

    for (let i = 0; i < n; i++) {
      let u = (t.current + i / n) % 1

      if (dir < 0) u = 1 - u

      get(u, tmp)

      pos[i * 3] = tmp.x
      pos[i * 3 + 1] = tmp.y
      pos[i * 3 + 2] = tmp.z
    }

    if (geo.current?.attributes.position) {
      geo.current.attributes.position.needsUpdate = true
    }
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geo}>
        <bufferAttribute
          attach="attributes-position"
          count={n}
          array={pos}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        ref={mat}
        map={tex}
        size={size}
        color={color}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0}
      />
    </points>
  )
}

const st = () => getState()

const ready = () => {
  const s = st()
  return s.power && s.stage >= 8 &&
    (s.stage < 9 || (live.served && live.acLoad > 0))
}

/** @type {Record<string, () => boolean>} */
const ACTIVE = {
  pv: () => live.pv > 0.5 && st().stage >= 4,
  ch: () => live.batW > 0.5,
  dc: () => {
    const s = st()
    return s.power && s.stage >= 7 &&
      (s.stage < 9 || (live.served && live.acLoad > 0))
  },
  ac1: ready,
  ac2: ready,
}

/**
 * @typedef {Object} WireData
 * @property {string} kind
 * @property {number} dir
 * @property {string} key
 * @property {THREE.Curve<THREE.Vector3>} curve
 */

export default function EnergyFlow() {
  return (
    <>
      {[-1, 0, 1].map((
        /** @type {number} */ k
      ) => (
        <Flow
          key={k}
          n={16}
          size={0.42}
          color="#ffd84a"
          get={(
            /** @type {number} */ u,
            /** @type {THREE.Vector3} */ o
          ) => o.set(
            THREE.MathUtils.lerp(sunPos.x + k * 0.6, -8 + k * 1.4, u),
            THREE.MathUtils.lerp(sunPos.y, 2.9, u),
            THREE.MathUtils.lerp(sunPos.z, -1.2, u)
          )}
          active={() => live.light > 0.03 && st().stage >= 1}
        />
      ))}

      {WIRES.map((
        /** @type {WireData} */ w,
        /** @type {number} */ i
      ) => (
        <Flow
          key={i}
          n={w.kind === 'ac' ? 12 : 13}
          color={w.kind === 'ac' ? '#37ff8b' : '#38b6ff'}
          dir={w.dir}
          get={(
            /** @type {number} */ u,
            /** @type {THREE.Vector3} */ o
          ) => w.curve.getPoint(u, o)}
          active={ACTIVE[w.key]}
        />
      ))}
    </>
  )
}
