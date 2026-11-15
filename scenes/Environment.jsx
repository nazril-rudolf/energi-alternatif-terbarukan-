
import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Grid, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { getState, useStore } from '../state/store'
import { live, sunPos } from '../state/live'
import { daylight } from '../simulations/energyModel'
import { QUALITY } from '../utils/quality'
import Grass from './Grass'
import Birds from './Birds'

// Pohon 3D dengan batang dan tiga lapisan daun.
function Tree({ position, scale = 1, phase = 0 }) {
  const canopy = useRef(null)

  useFrame(({ clock }) => {
    if (canopy.current) {
      const t = clock.elapsedTime + phase
      canopy.current.rotation.z = Math.sin(t * 0.5) * 0.025
      canopy.current.rotation.x = Math.cos(t * 0.4) * 0.015
    }
  })

  return (
    <group position={position} scale={scale}>
      {/* Batang pohon */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.23, 2, 10]} />
        <meshStandardMaterial color="#76502f" roughness={1} />
      </mesh>

      {/* Daun pohon */}
      <group ref={canopy}>
        <mesh position={[0, 2.05, 0]} castShadow>
          <coneGeometry args={[1.15, 1.8, 9]} />
          <meshStandardMaterial color="#286b35" roughness={1} />
        </mesh>

        <mesh position={[0, 2.85, 0]} castShadow>
          <coneGeometry args={[0.88, 1.55, 9]} />
          <meshStandardMaterial color="#347e3d" roughness={1} />
        </mesh>

        <mesh position={[0, 3.55, 0]} castShadow>
          <coneGeometry args={[0.58, 1.25, 9]} />
          <meshStandardMaterial color="#45934b" roughness={1} />
        </mesh>
      </group>
    </group>
  )
}

// Lingkungan laboratorium: langit, matahari, bulan,
// rumput, bintang, cahaya, pohon, dan meja kerja.
export default function Environment() {
  const cfg = QUALITY[
    useStore((/** @type {{ quality: string }} */ s) => s.quality)
  ]

  const dir = useRef(/** @type {THREE.DirectionalLight | null} */ (null))
  const hemi = useRef(/** @type {THREE.HemisphereLight | null} */ (null))
  const stars = useRef(/** @type {THREE.Group | null} */ (null))
  const moon = useRef(/** @type {THREE.Group | null} */ (null))
  const moonLight = useRef(/** @type {THREE.PointLight | null} */ (null))

  const { scene } = useThree()

  // Warna langit siang dan malam.
  const day = useMemo(() => new THREE.Color('#4b9fe8'), [])
  const night = useMemo(() => new THREE.Color('#101b35'), [])
  const tmp = useMemo(() => new THREE.Color(), [])

  useFrame(() => {
    const s = getState()

    // Perhitungan pencahayaan lama tetap dipertahankan.
    const df = s.mode === 'auto'
      ? THREE.MathUtils.clamp(
          0.15 + daylight(live.hour) * 1.6,
          0.15,
          1
        )
      : s.night ? 0.15 : 1

    // Warna langit mengikuti waktu siang dan malam.
    const skyFactor = s.mode === 'auto'
      ? THREE.MathUtils.clamp(daylight(live.hour), 0, 1)
      : s.night ? 0 : 1

    tmp.lerpColors(night, day, skyFactor)

    scene.background.copy(tmp)

    if (scene.fog) {
      scene.fog.color.copy(tmp)
    }

    // Cahaya matahari tetap menggunakan sistem sebelumnya.
    if (dir.current) {
      dir.current.position.copy(sunPos)
      dir.current.intensity = 0.1 + 2.6 * live.light
    }

    // Menghitung kekuatan cahaya bulan.
    const moonFactor = THREE.MathUtils.smoothstep(
      1 - skyFactor,
      0.25,
      0.85
    )

    // Cahaya lingkungan bertambah sedikit saat malam.
    if (hemi.current) {
      hemi.current.intensity =
        0.2 + 0.7 * df + 0.2 * moonFactor
    }

    // Bintang terlihat ketika langit mulai gelap.
    if (stars.current) {
      stars.current.visible = df < 0.7
    }

    // Bulan muncul dan menghilang secara otomatis.
    if (moon.current) {
      moon.current.visible = moonFactor > 0.05
    }

    // Cahaya bulan menerangi lingkungan.
    if (moonLight.current) {
      moonLight.current.intensity = 1.8 * moonFactor
    }
  })

  return (
    <>
      <color attach="background" args={['#4b9fe8']} />

      <fog attach="fog" args={['#4b9fe8', 45, 100]} />

      {/* Cahaya lingkungan */}
      <hemisphereLight
        ref={hemi}
        args={['#9cc8ff', '#0a1426', 0.8]}
      />

      {/* Cahaya matahari */}
      <directionalLight
        ref={dir}
        castShadow={!!cfg.shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={20}
        shadow-camera-bottom={-12}
        shadow-camera-near={1}
        shadow-camera-far={80}
        color="#fff0c8"
      />

      {/* Bintang malam */}
      <group ref={stars}>
        <Stars
          radius={90}
          depth={30}
          count={cfg.stars}
          factor={4}
          fade
        />
      </group>

      {/* Bulan 3D */}
      <group
        ref={moon}
        position={[-18, 17, -8]}
      >
        {/* Permukaan bulan */}
        <mesh>
          <sphereGeometry args={[1.65, 32, 32]} />

          <meshStandardMaterial
            color="#e1e9f5"
            emissive="#9ebce8"
            emissiveIntensity={0.85}
            roughness={1}
            metalness={0}
          />
        </mesh>

        {/* Kawah bulan sederhana */}
        <mesh position={[0.55, 0.35, 1.18]} scale={[0.25, 0.25, 0.08]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#b9c8dc" />
        </mesh>

        <mesh position={[-0.55, -0.35, 1.25]} scale={[0.18, 0.18, 0.07]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#b9c8dc" />
        </mesh>
      </group>

      {/* Cahaya bulan */}
      <pointLight
        ref={moonLight}
        position={[-18, 17, -8]}
        color="#b9d5ff"
        intensity={0}
        distance={75}
        decay={2}
      />

      {/* Permukaan tanah hijau */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[70, 64]} />

        <meshStandardMaterial
          color="#477f38"
          metalness={0}
          roughness={1}
        />
      </mesh>

      {/* Rumput 3D tertiup angin */}
      <Grass />

      {/* Empat pohon di area pinggir laboratorium */}
      <Tree position={[-25, 0, -22]} scale={1.1} phase={0} />
      <Tree position={[25, 0, -22]} scale={0.95} phase={1.5} />
      <Tree position={[-27, 0, 22]} scale={1} phase={2.5} />
      <Tree position={[27, 0, 22]} scale={1.15} phase={3.5} />

      {/* Burung terbang di langit */}
<Birds />

      {/* Grid teknologi */}
      <Grid
        position={[0, 0.01, 0]}
        args={[100, 100]}
        cellSize={1}
        sectionSize={5}
        cellColor="#12306a"
        sectionColor="#2d8cff"
        fadeDistance={60}
        fadeStrength={1.5}
        infiniteGrid
      />

      {/* Meja kerja */}
      <mesh
        position={[1.4, 0.84, 1.2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[11, 0.12, 2.6]} />

        <meshStandardMaterial
          color="#1a2745"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {[[-3.8, 0.3], [6.6, 0.3], [-3.8, 2.1], [6.6, 2.1]].map((
        /** @type {number[]} */ p,
        /** @type {number} */ i
      ) => (
        <mesh
          key={i}
          position={[p[0], 0.42, p[1] + 0.3]}
          castShadow
        >
          <boxGeometry args={[0.15, 0.84, 0.15]} />

          <meshStandardMaterial
            color="#2d3a5e"
            metalness={0.7}
          />
        </mesh>
      ))}
    </>
  )
}
