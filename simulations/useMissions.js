
import { useEffect } from 'react'
import { getState, setState } from '../state/store'
import { live } from '../state/live'
import { MISSIONS } from '../data/missions'
import { notify } from '../utils/notify'

// Memeriksa syarat misi setiap 0,5 detik.
export default function useMissions() {
  useEffect(() => {
    const id = setInterval(() => {
      MISSIONS.forEach((
        /** @type {typeof MISSIONS[number]} */ m
      ) => {
        const s = getState()

        if (s.done.includes(m.id) || !m.check(s, live, 0.5)) return

        setState({
          done: [...s.done, m.id],
          score: s.score + m.poin
        })

        notify(`Misi selesai: ${m.judul} (+${m.poin} poin)`)
      })
    }, 500)

    return () => clearInterval(id)
  }, [])
}
