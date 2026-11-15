
import { useSyncExternalStore } from 'react'
import { detectQuality } from '../utils/quality'
import { loadProgress } from '../utils/progress'

const saved = loadProgress()

/**
 * @typedef {Object} AppState
 * @property {string} view
 * @property {boolean} controlsOpen
 * @property {boolean} panelOpen
 * @property {boolean} power
 * @property {boolean} paused
 * @property {string} mode
 * @property {boolean} night
 * @property {number} sun
 * @property {string} weather
 * @property {number} stage
 * @property {number} stageMax
 * @property {boolean} running
 * @property {boolean} xray
 * @property {boolean} exploded
 * @property {boolean} autoRotate
 * @property {boolean} detail
 * @property {string|null} selected
 * @property {string|null} part
 * @property {string|null} hover
 * @property {any} camReq
 * @property {any} zoomReq
 * @property {any} quality
 * @property {boolean} voice
 * @property {number} volume
 * @property {number|null} tourIdx
 * @property {any} toast
 * @property {any} snap
 * @property {Object<string, boolean>} loads
 * @property {any[]} visited
 * @property {any[]} done
 * @property {number} score
 * @property {number} bestQuiz
 */

/** @type {AppState} */
let state = {
  view: 'lab',
  controlsOpen: false,
  panelOpen: false,
  power: true,
  paused: false,
  mode: 'manual',
  night: false,
  sun: 80,
  weather: 'cerah',
  stage: 9,
  stageMax: 0,
  running: false,
  xray: false,
  exploded: false,
  autoRotate: false,
  detail: false,
  selected: null,
  part: null,
  hover: null,
  camReq: null,
  zoomReq: null,
  quality: detectQuality(),
  voice: false,
  volume: 1,
  tourIdx: null,
  toast: null,
  snap: null,
  loads: {
    lampu: true,
    kipas: false,
    tv: false,
    komputer: false,
    pompa: false
  },
  visited: saved.visited || [],
  done: saved.done || [],
  score: saved.score || 0,
  bestQuiz: saved.bestQuiz || 0
}

const subs = new Set()

/** @returns {AppState} */
export const getState = () => state

/**
 * @param {() => void} f
 * @returns {() => void}
 */
export const subscribe = (f) => {
  subs.add(f)
  return () => subs.delete(f)
}

/**
 * @param {Partial<AppState> | ((state: AppState) => Partial<AppState>)} p
 */
export const setState = (p) => {
  const update = typeof p === 'function' ? p(state) : p
  state = { ...state, ...update }
  subs.forEach((f) => f())
}

/**
 * @template T
 * @param {(state: AppState) => T} sel
 * @returns {T}
 */
export const useStore = (sel) =>
  useSyncExternalStore(subscribe, () => sel(state))
