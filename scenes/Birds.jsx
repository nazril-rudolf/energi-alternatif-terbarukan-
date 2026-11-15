
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Satu burung 3D dengan animasi kepakan sayap.
function Bird({
  phase = 0,
  radiusX = 22,
  radiusZ = 20,
  height = 14,
  speed = 0.35,
  color = '#303b4d'
}) {
  const bird = useRef(null)
  const leftWing = useRef(null)
  const rightWing = useRef(null)

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime * speed + phase

    const x = Math.cos(elapsed) * radiusX
    const z = Math.sin(elapsed) * radiusZ
    const y = height + Math.sin(elapsed * 1.7) * 1.1

    if (bird.current) {
      bird.current.position.set(x, y, z)

      const dx = -Math.sin(elapsed) * radiusX
      const dz = Math.cos(elapsed) * radiusZ

      bird.current.rotation.y = Math.atan2(dx, dz)
      bird.current.rotation.z = Math.sin(elapsed * 2) * 0.04
    }

    // Animasi kepakan sayap.
    const flap = Math.sin(clock.elapsedTime * 9 + phase) * 0.65

    if (leftWing.current) {
      leftWing.current.rotation.z = flap
    }

    if (rightWing.current) {
      rightWing.current.rotation.z = -flap
    }
  })

  return (
    <group ref={bird}>
      {/* Badan burung */}
      <mesh scale={[0.17, 0.11, 0.38]}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>

      {/* Kepala */}
      <mesh position={[0, 0.035, 0.32]} scale={[0.11, 0.11, 0.11]}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>

      {/* Paruh */}
      <mesh
        position={[0, 0.025, 0.46]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.045, 0.12, 0.045]}
      >
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color="#d9a34b" roughness={1} />
      </mesh>

      {/* Sayap kiri */}
      <group ref={leftWing} position={[-0.12, 0.025, 0]}>
        <mesh position={[-0.22, 0, 0]} scale={[0.34, 0.045, 0.18]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
      </group>

      {/* Sayap kanan */}
      <group ref={rightWing} position={[0.12, 0.025, 0]}>
        <mesh position={[0.22, 0, 0]} scale={[0.34, 0.045, 0.18]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
      </group>

      {/* Ekor */}
      <mesh
        position={[0, 0, -0.38]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.12, 0.24, 0.045]}
      >
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
    </group>
  )
}

// Empat burung terbang dengan jalur dan kecepatan berbeda.
export default function Birds() {
  return (
    <group>
      <Bird phase={0} radiusX={22} radiusZ={19} height={14} speed={0.35} color="#303b4d" />
      <Bird phase={1.8} radiusX={25} radiusZ={21} height={16} speed={0.3} color="#465264" />
      <Bird phase={3.5} radiusX={20} radiusZ={24} height={13} speed={0.4} color="#38485a" />
      <Bird phase={5} radiusX={27} radiusZ={18} height={17} speed={0.28} color="#303b4d" />
    </group>
  )
}
