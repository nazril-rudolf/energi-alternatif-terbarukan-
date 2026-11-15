import * as THREE from 'three'
export function cellTexture() {
  const c = document.createElement('canvas'); c.width = 800; c.height = 500
  const x = c.getContext('2d'); x.fillStyle = '#071a45'; x.fillRect(0, 0, 800, 500)
  for (let i = 0; i < 10; i++) for (let j = 0; j < 6; j++) {
    const g = x.createLinearGradient(0, 0, 80, 80); g.addColorStop(0, '#15409e'); g.addColorStop(1, '#2a6fe0')
    x.fillStyle = g; x.fillRect(i * 80 + 4, j * 83 + 4, 72, 75)
    x.strokeStyle = 'rgba(200,225,255,.55)'
    ;[24, 48].forEach((d) => { x.beginPath(); x.moveTo(i * 80 + 4 + d, j * 83 + 4); x.lineTo(i * 80 + 4 + d, j * 83 + 79); x.stroke() })
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}
export function dotTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64
  const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.4, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)')
  x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c)
}
export function glareTexture() {
  const c = document.createElement('canvas'); c.width = 64; c.height = 8
  const x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 64, 0)
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)')
  x.fillStyle = g; x.fillRect(0, 0, 64, 8); return new THREE.CanvasTexture(c)
}
