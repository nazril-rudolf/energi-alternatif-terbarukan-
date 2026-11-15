import Part from './Part'
import Mat from './Mat'
import ScreenPlane from './ScreenPlane'
import { drawMonitor } from './screens'
export default function PowerMonitor() {
  return (
    <group position={[5.9, 1.3, 1.2]}>
      <Part comp="monitor" k="alat">
        <mesh castShadow><boxGeometry args={[1, 0.8, 0.35]} /><Mat color="#1d2a4a" metal={0.5} /></mesh>
        <ScreenPlane position={[0, 0, 0.18]} size={[0.85, 0.6]} draw={drawMonitor} />
      </Part>
    </group>
  )
}
