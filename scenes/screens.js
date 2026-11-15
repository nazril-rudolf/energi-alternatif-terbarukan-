// Fungsi penggambar layar kecil pada objek 3D (kanvas 2D menjadi tekstur).

/**
 * @typedef {object} LiveState
 * @property {number} vPv
 * @property {number} pv
 * @property {number} vBat
 * @property {number} soc
 * @property {string} status
 * @property {boolean} served
 * @property {number} acLoad
 * @property {boolean} short
 */

/**
 * @typedef {object} SimulationState
 * @property {boolean} power
 * @property {number} stage
 */

/**
 * @param {CanvasRenderingContext2D} x
 * @param {number} w
 * @param {number} h
 */
const bg = (x, w, h) => {
  x.fillStyle = '#03121a'
  x.fillRect(0, 0, w, h)
}

/**
 * @param {CanvasRenderingContext2D} x
 * @param {number} w
 * @param {number} h
 */
const off = (x, w, h) => {
  x.fillStyle = '#345'
  x.font = 'bold 28px monospace'
  x.fillText('OFF', w / 2 - 34, h / 2 + 8)
}

/**
 * @param {CanvasRenderingContext2D} x
 * @param {number} w
 * @param {number} h
 * @param {LiveState} L
 * @param {SimulationState} S
 */
export function drawController(x, w, h, L, S) {
  bg(x, w, h)
  if (!S.power) return off(x, w, h)

  x.fillStyle = '#2ee6a6'
  x.font = 'bold 16px monospace'
  x.fillText('SOLAR CHARGE CTRL', 10, 22)

  x.font = 'bold 22px monospace'
  x.fillStyle = '#8fd0ff'
  x.fillText(`PV  ${L.vPv.toFixed(1)}V ${Math.round(L.pv)}W`, 10, 66)

  x.fillStyle = '#ffd84a'
  x.fillText(`BAT ${L.vBat.toFixed(1)}V ${Math.round(L.soc)}%`, 10, 104)

  x.fillStyle = L.status === 'proteksi' ? '#ff4d5a' : '#2ee6a6'
  x.font = 'bold 19px monospace'
  x.fillText(L.status.toUpperCase(), 10, 142)
}

/**
 * @param {CanvasRenderingContext2D} x
 * @param {number} w
 * @param {number} h
 * @param {LiveState} L
 * @param {SimulationState} S
 */
export function drawInverter(x, w, h, L, S) {
  bg(x, w, h)
  if (!S.power || S.stage < 6) return off(x, w, h)

  const on = L.served && L.acLoad > 0

  x.fillStyle = on ? '#37ff8b' : '#567'
  x.font = 'bold 34px monospace'
  x.fillText(on ? '220 V AC' : '0 V', 14, 54)

  x.font = 'bold 20px monospace'
  x.fillText(`50 Hz  ${Math.round(L.acLoad)} W`, 14, 100)
}

/**
 * @param {CanvasRenderingContext2D} x
 * @param {number} w
 * @param {number} h
 * @param {LiveState} L
 * @param {SimulationState} S
 */
export function drawMonitor(x, w, h, L, S) {
  bg(x, w, h)
  if (!S.power) return off(x, w, h)

  x.font = 'bold 20px monospace'

  x.fillStyle = '#ffd84a'
  x.fillText(`Panel  ${Math.round(L.pv)} W`, 10, 40)

  x.fillStyle = '#37ff8b'
  x.fillText(`Beban  ${Math.round(L.acLoad)} W`, 10, 76)

  x.fillStyle = '#8fd0ff'
  x.fillText(`Baterai ${Math.round(L.soc)}%`, 10, 112)

  x.fillStyle = L.short ? '#ff4d5a' : '#2ee6a6'
  x.fillText(L.short ? 'KURANG' : 'AMAN', 10, 148)
}