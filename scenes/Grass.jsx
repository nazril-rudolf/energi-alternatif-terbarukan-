
import { useCallback, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Jumlah helai rumput.
const GRASS_COUNT = 4200

export default function Grass() {
  const windTime = useRef({ value: 0 })

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()

    geo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([
        -0.045, 0, 0,
         0.045, 0, 0,
         0.008, 0.48, 0
      ], 3)
    )

    geo.setAttribute(
      'aPhase',
      new THREE.InstancedBufferAttribute(
        new Float32Array(GRASS_COUNT),
        1
      )
    )

    geo.computeVertexNormals()
    geo.computeBoundingSphere()

    return geo
  }, [])

  // Shader untuk animasi rumput tertiup angin.
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.95,
      metalness: 0,
      side: THREE.DoubleSide,
      vertexColors: true
    })

    /**
     * @param {Parameters<THREE.Material['onBeforeCompile']>[0]} shader
     */
    const compileGrassShader = (shader) => {
      shader.uniforms.uTime = windTime.current

      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
         attribute float aPhase;
         uniform float uTime;`
      )

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>

         float windWave = sin(
           uTime * 1.7 + aPhase + position.y * 5.0
         );

         transformed.x += windWave * 0.16 * position.y;

         transformed.z +=
           cos(uTime * 1.25 + aPhase) *
           0.07 * position.y;
        `
      )
    }

    mat.onBeforeCompile = compileGrassShader
    mat.customProgramCacheKey = () => 'animated-grass-wind-v1'

    return mat
  }, [])

  // Menghitung seluruh data rumput satu kali.
  const instanceData = useMemo(() => {
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()

    const matrices = new Float32Array(
      GRASS_COUNT * 16
    )

    const colors = new Float32Array(
      GRASS_COUNT * 3
    )

    const phases = geometry.getAttribute('aPhase')

    let seed = 12345

    const random = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }

    let index = 0

    while (index < GRASS_COUNT) {
      const angle = random() * Math.PI * 2
      const radius = Math.sqrt(random()) * 32

      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius

      // Area meja dan peralatan utama dibiarkan kosong.
      if (
        x > -5.5 &&
        x < 8 &&
        z > -1.8 &&
        z < 3.8
      ) {
        continue
      }

      const height = 0.55 + random() * 0.85
      const width = 0.7 + random() * 0.5

      dummy.position.set(x, 0.015, z)
      dummy.rotation.set(0, random() * Math.PI * 2, 0)
      dummy.scale.set(width, height, width)
      dummy.updateMatrix()

      // Simpan matriks posisi, rotasi, dan ukuran.
      dummy.matrix.toArray(
        matrices,
        index * 16
      )

      // Fase animasi angin.
      phases.setX(
        index,
        random() * Math.PI * 2
      )

      // Variasi warna rumput.
      const green = 0.65 + random() * 0.35

      color.setRGB(
        0.35 + random() * 0.12,
        green,
        0.22 + random() * 0.08
      )

      const colorOffset = index * 3

      colors[colorOffset] = color.r
      colors[colorOffset + 1] = color.g
      colors[colorOffset + 2] = color.b

      index++
    }

    phases.needsUpdate = true

    return {
      matrices,
      colors
    }
  }, [geometry])

  // Animasi angin.
  /**
   * @param {import('@react-three/fiber').RootState} _state
   * @param {number} delta
   */
  const updateWind = (_state, delta) => {
    windTime.current.value += Math.min(delta, 0.05)
  }

  useFrame(updateWind)

  // Memasang data yang sudah dihitung ke InstancedMesh.
  const setGrassRef = useCallback(
    /**
     * @param {THREE.InstancedMesh | null} mesh
     */
    (mesh) => {
      if (!mesh) return

      mesh.instanceMatrix.array.set(
        instanceData.matrices
      )

      mesh.instanceMatrix.needsUpdate = true

      mesh.instanceColor =
        new THREE.InstancedBufferAttribute(
          instanceData.colors,
          3
        )

      mesh.instanceColor.needsUpdate = true
    },
    [instanceData]
  )

  return (
    <instancedMesh
      ref={setGrassRef}
      args={[geometry, material, GRASS_COUNT]}
      frustumCulled={false}
      castShadow={false}
      receiveShadow={false}
    />
  )
}
