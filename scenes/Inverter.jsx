import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Part from './Part'
import Mat from './Mat'
import ScreenPlane from './ScreenPlane'
import useExplode from './useExplode'
import { drawInverter } from './screens'
import { live } from '../state/live'
import { getState } from '../state/store'

export default function Inverter() {
  const r = useExplode(), led = useRef()
  useFrame(() => { if (led.current) led.current.emissiveIntensity = getState().power && live.served && live.acLoad > 0 ? 2.4 : 0 })
  return (
    <group position={[2, 1.5, 1.2]}>
      <Part comp="inverter" k="heatsink" refs={r} base={[0, 0, -0.25]} off={[0, 0, -0.9]} label="Heatsink pendingin">
        <mesh castShadow><boxGeometry args={[1.8, 1.2, 0.1]} /><Mat color="#aab4c4" metal={0.9} rough={0.35} /></mesh>
        {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.8 + i * 0.2, 0, -0.12]}><boxGeometry args={[0.05, 1.1, 0.2]} /><Mat color="#aab4c4" metal={0.9} rough={0.35} /></mesh>)}
      </Part>
      <Part comp="inverter" k="pcb" refs={r} off={[0, 0, 0.35]} label="Rangkaian & transformator">
        <mesh><boxGeometry args={[1.6, 1, 0.04]} /><Mat color="#0b7a4b" rough={0.6} /></mesh>
        <mesh position={[-0.4, 0, 0.12]}><cylinderGeometry args={[0.28, 0.28, 0.2, 24]} /><Mat color="#d9832a" /></mesh>
        <mesh position={[0.4, 0.15, 0.07]}><boxGeometry args={[0.5, 0.25, 0.1]} /><Mat color="#111" /></mesh>
      </Part>
      <Part comp="inverter" k="penutup" refs={r} base={[0, 0, 0.2]} off={[0, 0, 1.3]} label="Penutup & layar">
        <mesh castShadow><boxGeometry args={[1.8, 1.2, 0.12]} /><Mat color="#1d2a4a" metal={0.5} /></mesh>
        <ScreenPlane position={[0, 0.2, 0.07]} size={[1, 0.5]} px={[256, 128]} draw={drawInverter} />
        <mesh position={[-0.6, -0.4, 0.08]}><sphereGeometry args={[0.06, 12, 12]} /><meshStandardMaterial ref={led} color="#333" emissive="#37ff8b" emissiveIntensity={0} /></mesh>
      </Part>
    </group>
  )
}
