
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { getState, setState, useStore } from '../state/store'
import { PARTS } from '../data/components'
import { focusOn } from '../animations/camera'

// Bagian objek yang dapat diklik, di-hover, dan (opsional) dibongkar.
// comp: kunci komponen, k: kunci bagian, base: posisi awal, off: jarak bongkar.

/**
 * @param {{
 *   comp: string,
 *   k?: string,
 *   refs?: React.MutableRefObject<Record<string, THREE.Group | null>>,
 *   base?: [number, number, number],
 *   off?: [number, number, number],
 *   label?: string,
 *   children?: React.ReactNode
 * }} props
 */
export default function Part({
  comp,
  k = 'badan',
  refs,
  base = [0, 0, 0],
  off = [0, 0, 0],
  label,
  children
}) {
  const show = useStore((/** @type {{ xray: boolean, exploded: boolean }} */ s) =>
    s.xray || s.exploded
  )

  /** @param {THREE.Group | null} o */
  const set = (o) => {
    if (o) {
      o.userData = { base, off }
      o.position.set(...base)

      if (refs) {
        refs.current[`${comp}.${k}`] = o
      }
    }
  }

  /** @param {import('three').ThreeEvent<MouseEvent>} e */
  const click = (e) => {
    e.stopPropagation()

    const s = getState()
    const inner = (s.exploded || s.xray) && PARTS[comp]?.[k]

    if (s.selected !== comp) focusOn(comp)

    setState({
      selected: comp,
      part: inner ? k : null,
      view: 'lab',
      panelOpen: true,
      visited: s.visited.includes(comp)
        ? s.visited
        : [...s.visited, comp]
    })
  }

  return (
    <group
      ref={set}
      onClick={click}
      onPointerOver={(/** @type {import('three').ThreeEvent<PointerEvent>} */ e) => {
        e.stopPropagation()
        setState({ hover: { comp, k } })
      }}
      onPointerOut={() => setState({ hover: null })}
    >
      {children}

      {show && label && (
        <Html center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <span className="tag3d">{label}</span>
        </Html>
      )}
    </group>
  )
}
