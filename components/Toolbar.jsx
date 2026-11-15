
import { Power, PowerOff, Play, Pause, RotateCcw, Cpu, Hand, ZoomIn, ZoomOut, Rotate3d, Boxes, Scan, Maximize, Sun, Moon, CloudSun, Cloudy, CloudRain } from 'lucide-react'
import Btn from './Btn'
import { actions } from '../controls/actions'
import { setView } from '../animations/camera'
import { setState, useStore } from '../state/store'
import { WEATHER } from '../simulations/energyModel'

/**
 * @typedef {Object} ToolbarState
 * @property {boolean} power
 * @property {boolean} running
 * @property {boolean} paused
 * @property {string} mode
 * @property {boolean} autoRotate
 * @property {boolean} exploded
 * @property {boolean} xray
 * @property {boolean} night
 * @property {string} weather
 * @property {number} sun
 */

const MAIN = /** @type {Array<[string, import('lucide-react').LucideIcon, string, ((s: ToolbarState) => boolean)?, string?, ((s: ToolbarState) => boolean)?]>} */ ([
  ['POWER ON', Power, 'powerOn', (s) => s.power],
  ['POWER OFF', PowerOff, 'powerOff', (s) => !s.power, 'red'],
  ['START SIMULATION', Play, 'start', (s) => s.running],
  ['PAUSE', Pause, 'pause', (s) => s.paused],
  ['RESUME', Play, 'resume', (s) => !s.paused, '', (s) => !s.paused],
  ['RESET', RotateCcw, 'reset'],
  ['AUTO MODE', Cpu, 'autoMode', (s) => s.mode === 'auto'],
  ['MANUAL MODE', Hand, 'manualMode', (s) => s.mode === 'manual'],
  ['ZOOM IN', ZoomIn, 'zoomIn'],
  ['ZOOM OUT', ZoomOut, 'zoomOut'],
  ['ROTATE CAMERA', Rotate3d, 'rotate', (s) => s.autoRotate],
  ['EXPLODED VIEW', Boxes, 'explode', (s) => s.exploded, 'violet'],
  ['X-RAY MODE', Scan, 'xray', (s) => s.xray, 'violet'],
  ['FULL SCREEN', Maximize, 'fullscreen'],
  ['DAY MODE', Sun, 'day', (s) => s.mode === 'manual' && !s.night],
  ['NIGHT MODE', Moon, 'night', (s) => s.night],
])

const VIEWS = [
  ['Front View', 'front'],
  ['Back View', 'back'],
  ['Top View', 'top'],
  ['Side View', 'side'],
  ['Isometric View', 'iso'],
  ['Free Camera', 'free']
]

const WICON = { cerah: Sun, berawan: CloudSun, mendung: Cloudy, hujan: CloudRain }

export default function Toolbar() {
  const s = useStore((/** @type {ToolbarState} */ x) => x)

  return (
    <section className="tools" aria-label="Kontrol">
      <div className="row">{MAIN.map(([l, I, a, act, tone, dis]) => <Btn key={l} label={l} icon={I} tone={tone} active={act && act(s)} disabled={dis && dis(s)} onClick={actions[a]} />)}</div>
      <div className="row">
        {VIEWS.map(([l, k]) => <Btn key={k} label={l} tone="ghost" onClick={() => setView(k)} />)}
        {Object.keys(WEATHER).map((/** @type {keyof typeof WEATHER} */ k) => <Btn key={k} label={WEATHER[k].nama} icon={WICON[k]} tone="ghost" active={s.weather === k} onClick={() => setState({ weather: k })} />)}
        <label className="sl">Intensitas matahari <output>{s.sun}%</output><input type="range" min="0" max="100" value={s.sun} onChange={(/** @type {React.ChangeEvent<HTMLInputElement>} */ e) => setState({ sun: +e.target.value })} /></label>
      </div>
    </section>
  )
}
