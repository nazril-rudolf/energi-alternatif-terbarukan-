
import { useRef } from 'react'
import gsap from 'gsap'

// Tombol dengan efek ripple, animasi tekan, dan status aktif.
export default function Btn({
  icon: I,
  label,
  active,
  tone = '',
  onClick,
  disabled,
  title
}) {
  const ref = useRef(null)

  /** @param {import('react').MouseEvent<HTMLButtonElement>} e */
  const click = (e) => {
    const b = ref.current

    if (b) {
      const r = b.getBoundingClientRect()
      const d = Math.max(r.width, r.height)
      const s = document.createElement('span')

      s.className = 'rp'
      s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`

      b.appendChild(s)
      setTimeout(() => s.remove(), 600)

      gsap.fromTo(
        b,
        { scale: 0.9 },
        { scale: 1, duration: 0.45, ease: 'elastic.out(1,.4)' }
      )
    }

    if (onClick) onClick(e)
  }

  return (
    <button
      ref={ref}
      className={`btn ${tone} ${active ? 'on' : ''}`}
      onClick={click}
      disabled={disabled}
      aria-pressed={!!active}
      title={title || label}
    >
      {I && <I size={15} />}
      <span>{label}</span>
    </button>
  )
}
