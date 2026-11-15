
import { useEffect, useState } from 'react'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import SolarLaboratory from './scenes/SolarLaboratory'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import Dashboard from './components/Dashboard'
import InfoPanel from './components/InfoPanel'
import Quiz from './components/Quiz'
import Learning from './components/Learning'
import Mission from './components/Mission'
import Tour from './components/Tour'
import Settings from './components/Settings'
import Tooltip from './components/Tooltip'
import Toast from './components/Toast'
import Loading from './components/Loading'
import ErrorBoundary from './components/ErrorBoundary'
import useEnergySim from './simulations/useEnergySim'
import useMissions from './simulations/useMissions'
import { setState, useStore } from './state/store'

const PANELS = {
  lab: InfoPanel,
  misi: Mission,
  tur: Tour,
  kuis: Quiz,
  materi: Learning,
  set: Settings
}

export default function App() {
  useEnergySim()
  useMissions()

  const [ready, setReady] = useState(false)

  const view = useStore(
    (/** @type {{ view: keyof typeof PANELS }} */ s) => s.view
  )

  const open = useStore(
    (/** @type {{ panelOpen: boolean }} */ s) => s.panelOpen
  )

  const Panel = PANELS[view] || InfoPanel

  useEffect(() => {
    setState({
      controlsOpen: false,
      panelOpen: false
    })

    const t = setTimeout(() => setReady(true), 1600)

    return () => clearTimeout(t)
  }, [])

  // Tombol ini hanya mengatur panel kanan.
  const togglePanel = () => {
    setState({ panelOpen: !open })
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="stage">
        <ErrorBoundary>
          <SolarLaboratory />
        </ErrorBoundary>

        <Dashboard />
        <Tooltip />
        <Toast />

        <button
          className="ptoggle glass"
          onClick={togglePanel}
          aria-label={open ? 'Tutup panel kanan' : 'Buka panel kanan'}
          aria-expanded={open}
          title={open ? 'Tutup panel kanan' : 'Buka panel kanan'}
        >
          {open
            ? <PanelRightClose size={20} />
            : <PanelRightOpen size={20} />
          }
        </button>
      </main>

      <aside className={'panel' + (open ? ' open' : '')}>
        <Panel />
      </aside>

      <Toolbar />

      {!ready && <Loading />}
    </div>
  )
}
