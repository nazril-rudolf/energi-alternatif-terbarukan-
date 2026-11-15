import { Canvas } from '@react-three/fiber'
import { setState, useStore } from '../state/store'
import { QUALITY } from '../utils/quality'
import Environment from './Environment'
import Weather from './Weather'
import Sun from './Sun'
import SolarPanel from './SolarPanel'
import Controller from './Controller'
import Battery from './Battery'
import Inverter from './Inverter'
import Distribution from './Distribution'
import PowerMonitor from './PowerMonitor'
import House from './House'
import Cables from './Cables'
import EnergyFlow from './EnergyFlow'
import SelectRing from './SelectRing'
import CameraRig from './CameraRig'

// Scene utama laboratorium. Kualitas grafis mengatur dpr, bayangan, dan antialiasing.
export default function SolarLaboratory() {
  const cfg = QUALITY[
    useStore((/** @type {{ quality: string }} */ s) => s.quality)
  ]

  return (
    <Canvas
      key={cfg.aa ? 'aa' : 'noaa'}
      shadows={cfg.shadows}
      dpr={cfg.dpr}
      gl={{
        antialias: cfg.aa,
        powerPreference: 'high-performance'
      }}
      camera={{
        position: [34, 20, 36],
        fov: 45,
        near: 0.1,
        far: 220
      }}
      onPointerMissed={() => setState({ selected: null, part: null })}
    >
      <Environment />
      <Weather />
      <Sun />
      <SolarPanel />
      <Controller />
      <Battery />
      <Inverter />
      <Distribution />
      <PowerMonitor />
      <House />
      <Cables />
      <EnergyFlow />
      <SelectRing />
      <CameraRig />
    </Canvas>
  )
}