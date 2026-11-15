
import { useEffect, useRef } from 'react'
import { INFO, PARTS } from '../data/components'
import { useStore } from '../state/store'

export default function Tooltip() {
  const h = useStore((/** @type {{ hover: { comp: string, k: string } | null }} */ s) => s.hover),
    inner = useStore((/** @type {{ xray: boolean, exploded: boolean }} */ s) => s.xray || s.exploded),
    ref = useRef(null)

  useEffect(() => {
    const m = (/** @type {PointerEvent} */ e) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX + 14}px,${e.clientY + 14}px)`
    }
    addEventListener('pointermove', m)
    return () => removeEventListener('pointermove', m)
  }, [])

  if (!h) return null

  return <div ref={ref} className="tip">{(inner && PARTS[h.comp]?.[h.k]?.nama) || INFO[h.comp]?.nama}</div>
}
