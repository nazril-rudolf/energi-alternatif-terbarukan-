
import * as THREE from 'three'

/**
 * Membuat jalur kabel 3D menggunakan titik koordinat.
 * @param {Array<[number, number, number]>} points
 * @returns {THREE.CatmullRomCurve3}
 */
function makeWire(points) {
  const vectors = points.map(
    ([x, y, z]) => new THREE.Vector3(x, y, z)
  )

  return new THREE.CatmullRomCurve3(
    vectors,
    false,
    'centripetal',
    0.5
  )
}

// Jalur kabel instalasi PLTS.
export const WIRES = [
  {
    id: 'kabel_pv',
    kind: 'dc',
    key: 'pv',
    dir: 1,
    color: '#e5242a',
    curve: makeWire([
      [-6.3, 2.0, -1.0],
      [-5.5, 1.5, -0.5],
      [-4.5, 1.3, 0.5],
      [-3.4, 1.7, 1.2]
    ])
  },
  {
    id: 'kabel_baterai',
    kind: 'dc',
    key: 'ch',
    dir: 1,
    color: '#15181d',
    curve: makeWire([
      [-3.4, 1.2, 1.2],
      [-2.5, 0.8, 1.5],
      [-1.5, 0.8, 1.5],
      [-0.6, 1.45, 1.2]
    ])
  },
  {
    id: 'kabel_dc',
    kind: 'dc',
    key: 'dc',
    dir: 1,
    color: '#e5242a',
    curve: makeWire([
      [-0.6, 1.0, 1.7],
      [0.3, 0.7, 1.9],
      [1.2, 0.8, 1.7],
      [2.0, 1.5, 1.2]
    ])
  },
  {
    id: 'kabel_ac',
    kind: 'ac',
    key: 'ac1',
    dir: 1,
    color: '#37ff8b',
    curve: makeWire([
      [2.0, 1.0, 1.7],
      [2.8, 0.8, 2.0],
      [3.5, 0.8, 1.8],
      [4.2, 1.6, 1.2]
    ])
  },
  {
    id: 'kabel_ac_rumah',
    kind: 'ac',
    key: 'ac2',
    dir: 1,
    color: '#37ff8b',
    curve: makeWire([
      [4.2, 1.0, 1.5],
      [6.0, 0.8, 1.8],
      [8.5, 0.7, 1.5],
      [10.0, 0.7, 0.5],
      [13.2, 1.0, 0.0]
    ])
  }
]
