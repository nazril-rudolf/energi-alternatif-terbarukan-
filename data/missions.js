
let hold = 0 // detik berturut-turut syarat misi 6 terpenuhi

/**
 * @typedef {Object} MissionState
 * @property {string[]} visited
 * @property {number} stageMax
 * @property {Record<string, boolean>} loads
 */

/**
 * @typedef {Object} SimulationLive
 * @property {boolean} served
 * @property {number} acLoad
 * @property {number} soc
 */

export const MISSIONS = [
  {
    id: 'm1',
    judul: 'Kenali semua komponen',
    petunjuk: 'Klik minimal 8 objek 3D yang berbeda.',
    target: '8 komponen dibuka',
    poin: 100,
    check: (/** @type {MissionState} */ s) => s.visited.length >= 8,
    selesai: 'Setiap komponen punya fungsi masing-masing agar listrik surya dapat dipakai.'
  },
  {
    id: 'm2',
    judul: 'Temukan fungsi Solar Charge Controller',
    petunjuk: 'Klik controller lalu baca fungsinya.',
    target: 'Informasi controller dibuka',
    poin: 100,
    check: (/** @type {MissionState} */ s) => s.visited.includes('controller'),
    selesai: 'Controller melindungi baterai dari kelebihan isi dan pengosongan total.'
  },
  {
    id: 'm3',
    judul: 'Jalankan simulasi dari matahari hingga baterai',
    petunjuk: 'Tekan START SIMULATION dan tunggu sampai tahap baterai.',
    target: 'Mencapai tahap 6',
    poin: 150,
    check: (/** @type {MissionState} */ s) => s.stageMax >= 6,
    selesai: 'Cahaya menjadi listrik DC, lalu disimpan di baterai lewat controller.'
  },
  {
    id: 'm4',
    judul: 'Aktifkan inverter',
    petunjuk: 'Biarkan simulasi sampai tahap inverter.',
    target: 'Mencapai tahap 7',
    poin: 100,
    check: (/** @type {MissionState} */ s) => s.stageMax >= 7,
    selesai: 'Inverter mengubah DC dari baterai menjadi AC untuk peralatan rumah.'
  },
  {
    id: 'm5',
    judul: 'Nyalakan lampu memakai energi yang tersedia',
    petunjuk: 'Nyalakan lampu LED pada daftar peralatan.',
    target: 'Lampu menyala',
    poin: 100,
    check: (
      /** @type {MissionState} */ s,
      /** @type {SimulationLive} */ l
    ) => s.loads.lampu && l.served && l.acLoad > 0,
    selesai: 'Lampu LED hemat daya sehingga cocok untuk sistem surya kecil.'
  },
  {
    id: 'm6',
    judul: 'Atur energi agar baterai tidak cepat habis',
    petunjuk: 'Nyalakan minimal 2 alat dan jaga baterai di atas 40% selama 30 detik.',
    target: '30 detik stabil',
    poin: 150,
    check: (
      /** @type {MissionState} */ s,
      /** @type {SimulationLive} */ l,
      /** @type {number} */ dt
    ) => {
      const n = Object.values(s.loads).filter(Boolean).length
      hold = n >= 2 && l.served && l.soc >= 40 ? hold + dt : 0
      return hold >= 30
    },
    selesai: 'Menyesuaikan pemakaian dengan energi yang tersedia membuat baterai awet.'
  },
]

/**
 * @param {number} score
 */
export const level = (score) => Math.floor(score / 200) + 1
