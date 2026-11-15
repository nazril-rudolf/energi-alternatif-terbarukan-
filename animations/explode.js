
import gsap from 'gsap'
import { anim } from '../state/live'
import { setState } from '../state/store'
import { setView } from './camera'

// Animasi bongkar dan susun kembali.
// Objek 3D membaca anim.explode pada setiap frame.

/**
 * Mengaktifkan atau menonaktifkan animasi Exploded View.
 * @param {boolean} on
 */
export function setExplode(on) {
  gsap.to(anim, {
    explode: on ? 1 : 0,
    duration: 1.6,
    ease: 'power2.inOut'
  })

  setState({ exploded: on })

  if (on) {
    setView('front')
  }
}

