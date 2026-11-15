
import { useStore } from '../state/store'

/**
 * @param {{
 *   color: string,
 *   metal?: number,
 *   rough?: number,
 *   opacity?: number
 * }} props
 */

// Material standar. Pada mode X-Ray semua material menjadi transparan.
export default function Mat({ color, metal = 0.3, rough = 0.5, opacity = 1 }) {
  const x = useStore((/** @type {{ xray: boolean }} */ s) => s.xray)

  return (
    <meshStandardMaterial
      color={color}
      metalness={metal}
      roughness={rough}
      transparent={x || opacity < 1}
      opacity={x ? Math.min(opacity, 0.28) : opacity}
      depthWrite={!x}
    />
  )
}
