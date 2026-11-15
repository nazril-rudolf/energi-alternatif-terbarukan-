
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStore } from '../state/store'

export default function Toast() {
  const t = useStore((/** @type {{ toast: { text: string } | null }} */ s) => s.toast),
    ref = useRef(null)

  useEffect(() => {
    if (!t || !ref.current) return
    gsap.killTweensOf(ref.current)
    gsap.fromTo(ref.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 })
    gsap.to(ref.current, { opacity: 0, delay: 3, duration: 0.5 })
  }, [t])

  return <div ref={ref} className="toast" role="status">{t ? t.text : ''}</div>
}
