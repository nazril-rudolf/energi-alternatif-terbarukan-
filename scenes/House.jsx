import Part from './Part'
import Mat from './Mat'
import useExplode from './useExplode'
import { Lamp, Fan, Television, Computer, Pump } from './Appliances'
// Rumah boneka tanpa dinding depan agar peralatan terlihat. Atap terangkat saat Exploded View.
export default function House() {
  const r = useExplode()
  return (
    <group position={[13.2, 0, 0]}>
      <Part comp="rumah" k="lantai"><mesh position={[0, 0.1, 0]} receiveShadow castShadow><boxGeometry args={[6.6, 0.2, 4]} /><Mat color="#c9bfae" rough={0.8} /></mesh></Part>
      <Part comp="rumah" k="dinding">
        <mesh position={[0, 1.9, -1.9]} castShadow receiveShadow><boxGeometry args={[6.6, 3.4, 0.2]} /><Mat color="#e9e2d3" rough={0.8} /></mesh>
        <mesh position={[-3.3, 1.9, 0]} castShadow><boxGeometry args={[0.2, 3.4, 4]} /><Mat color="#e2d9c8" rough={0.8} /></mesh>
        <mesh position={[3.3, 1.9, 0]} castShadow><boxGeometry args={[0.2, 3.4, 4]} /><Mat color="#e2d9c8" rough={0.8} /></mesh>
      </Part>
      <Part comp="rumah" k="atap" refs={r} base={[0, 3.9, 0]} off={[0, 3, 0]} label="Atap">
        {[-1, 1].map((s) => <mesh key={s} position={[s * 1.7, 0, 0]} rotation={[0, 0, -s * 0.38]} castShadow><boxGeometry args={[3.9, 0.15, 4.3]} /><Mat color="#b3452f" rough={0.7} /></mesh>)}
      </Part>
      <Lamp /><Television /><Computer /><Fan /><Pump />
    </group>
  )
}
