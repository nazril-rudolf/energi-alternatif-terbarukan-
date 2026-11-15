// Model energi edukatif (fungsi murni).
// Nilai adalah ilustrasi, bukan pengukuran perangkat nyata.

/**
 * @typedef {'cerah' | 'berawan' | 'mendung' | 'hujan'} WeatherType
 */

/**
 * @typedef {object} EnergyConfig
 * @property {'auto' | 'manual'} mode
 * @property {boolean} night
 * @property {number} sun
 * @property {WeatherType} weather
 * @property {boolean} power
 * @property {number} stage
 * @property {Record<string, boolean>} loads
 */

/**
 * @typedef {object} EnergyLive
 * @property {number} hour
 * @property {number} light
 * @property {number} pv
 * @property {number} vPv
 * @property {number} iPv
 * @property {number} acLoad
 * @property {number} dcNeed
 * @property {number} soc
 * @property {boolean} cut
 * @property {boolean} served
 * @property {boolean} short
 * @property {number} batW
 * @property {number} vBat
 * @property {number} iBat
 * @property {string} status
 */

export const WEATHER = {
  cerah: { nama: 'Cerah', f: 1 },
  berawan: { nama: 'Berawan', f: 0.55 },
  mendung: { nama: 'Mendung', f: 0.25 },
  hujan: { nama: 'Hujan', f: 0.12 },
}

export const LOADS = {
  lampu: { nama: 'Lampu LED', w: 10 },
  kipas: { nama: 'Kipas angin', w: 40 },
  tv: { nama: 'Televisi', w: 80 },
  komputer: { nama: 'Komputer', w: 120 },
  pompa: { nama: 'Pompa air', w: 150 },
}

// wp: daya puncak panel, eff: efisiensi sistem, invEff: efisiensi inverter,
// capWh: kapasitas baterai, minSoc: batas aman, ts: jam simulasi per detik nyata.

export const SPEC = {
  wp: 400,
  eff: 0.85,
  invEff: 0.9,
  capWh: 1200,
  minSoc: 20,
  ts: 0.25,
}

/**
 * @param {number} v
 * @param {number} a
 * @param {number} b
 */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

/**
 * @param {number} hour
 */
export const daylight = (hour) =>
  Math.max(0, Math.sin((Math.PI * (hour - 6)) / 12))

/**
 * @param {EnergyLive} live
 * @param {EnergyConfig} c
 * @param {number} dt
 */
export function stepEnergy(live, c, dt) {
  const h = dt * SPEC.ts

  if (c.mode === 'auto') {
    live.hour = (live.hour + h) % 24
  }

  const day = c.mode === 'auto'
    ? daylight(live.hour)
    : c.night ? 0 : 1

  live.light = day * (c.sun / 100) * WEATHER[c.weather].f

  const on = c.power && c.stage >= 3
  const full = c.power && c.stage >= 9

  live.pv = on ? SPEC.wp * live.light * SPEC.eff : 0
  live.vPv = live.pv > 1 ? 17 + 3 * Math.sqrt(live.light) : 0
  live.iPv = live.vPv ? live.pv / live.vPv : 0

  live.acLoad = full
    ? Object.keys(LOADS).reduce(
        (a, k) => a + (c.loads[k] ? LOADS[k].w : 0),
        0
      )
    : 0

  live.dcNeed = live.acLoad / SPEC.invEff

  if (live.soc <= SPEC.minSoc) {
    live.cut = true
  } else if (live.soc >= SPEC.minSoc + 10) {
    live.cut = false
  }

  let ch = 0
  let dis = 0
  let served = false
  let st = c.power ? 'siaga' : 'mati'

  if (c.power && c.stage >= 5) {
    const pv = live.pv
    const need = live.dcNeed

    if (pv >= need) {
      served = full
      const s = pv - need

      if (s > 0.5) {
        if (live.soc < 100) {
          ch = s
          st = 'mengisi'
        } else {
          st = 'penuh'
        }
      }
    } else if (!live.cut) {
      served = true
      dis = need - pv
      st = 'menyalurkan'
    } else {
      ch = pv
      st = 'proteksi'
    }
  }

  live.soc = clamp(
    live.soc + ((ch * 0.92 - dis / 0.95) * h / SPEC.capWh) * 100,
    0,
    100
  )

  if (live.soc >= 100 && ch > 0) {
    ch = 0
    st = 'penuh'
  }

  Object.assign(live, {
    served,
    short: full && live.acLoad > 0 && !served,
    batW: ch - dis,
    status: st
  })

  live.vBat =
    11.6 + 1.8 * (live.soc / 100) +
    (ch > 0 ? 0.4 : 0) -
    (dis > 0 ? 0.3 : 0)

  live.iBat = live.batW / live.vBat
}