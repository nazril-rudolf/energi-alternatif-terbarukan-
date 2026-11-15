
import Part from './Part'
import Mat from './Mat'
import { WIRES } from './paths'

// Kabel positif (merah), negatif (hitam), dan AC.
export default function Cables() {
  return WIRES.map((
    /** @type {{ id: string, curve: import('three').Curve<import('three').Vector3>, color: string }} */ w,
    /** @type {number} */ i
  ) => (
    <Part key={i} comp={w.id} k="kabel">
      <mesh castShadow>
        <tubeGeometry args={[w.curve, 40, w.id === 'kabel_ac' ? 0.05 : 0.055, 8, false]} />
        <Mat color={w.color} rough={0.5} />
      </mesh>
    </Part>
  ))
}
