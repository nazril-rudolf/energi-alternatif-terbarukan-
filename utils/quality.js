// Deteksi kemampuan perangkat dan daftar pengaturan grafis.
export function detectQuality() {
  const mobile = /Android|iPhone|iPad/i.test(navigator.userAgent)
  const cores = navigator.hardwareConcurrency || 4
  const mem = navigator.deviceMemory || 4
  if (mobile) return cores <= 6 || mem <= 3 ? 'low' : 'medium'
  return cores <= 4 || mem <= 2 ? 'medium' : 'high'
}
export const QUALITY = {
  low: { dpr: 1, shadows: false, aa: false, rain: 150, stars: 500 },
  medium: { dpr: [1, 1.5], shadows: true, aa: true, rain: 350, stars: 1500 },
  high: { dpr: [1, 2], shadows: true, aa: true, rain: 700, stars: 3000 },
}
