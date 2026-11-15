import Part from './Part'
import Mat from './Mat'
// Kotak distribusi listrik dengan tiga pemutus sirkuit (MCB).
export default function Distribution() {
  return (
    <group position={[4.2, 1.6, 1.2]}>
      <Part comp="distribusi" k="kotak">
        <mesh castShadow><boxGeometry args={[1.2, 1.4, 0.5]} /><Mat color="#9aa6bd" metal={0.7} rough={0.35} /></mesh>
        {[-0.3, 0, 0.3].map((x) => <mesh key={x} position={[x, 0.2, 0.27]}><boxGeometry args={[0.2, 0.35, 0.08]} /><Mat color="#1d2a4a" /></mesh>)}
        <mesh position={[0, -0.35, 0.27]}><boxGeometry args={[0.9, 0.3, 0.04]} /><Mat color="#e5e9f2" /></mesh>
      </Part>
    </group>
  )
}
