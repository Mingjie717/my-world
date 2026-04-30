'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function useMouseNorm() {
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])
  return mouse
}

function LookCamera({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree()
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  useFrame(() => {
    euler.current.y += (-mouse.current.x * 0.45 - euler.current.y) * 0.035
    euler.current.x += (mouse.current.y * 0.15 - euler.current.x) * 0.035
    euler.current.x = Math.max(-0.2, Math.min(0.2, euler.current.x))
    camera.rotation.copy(euler.current)
  })
  return null
}

// Water surface shader — pale blue-grey (Doig 100 Years Ago)
const VS = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const FS = `
  varying vec2 vUv; uniform float uTime;
  void main() {
    float r = sin(vUv.x * 18.0 + uTime * 0.3) * 0.5 + 0.5;
    float g = sin(vUv.y * 12.0 - uTime * 0.2) * 0.5 + 0.5;
    float w = smoothstep(0.55, 0.75, (r + g) * 0.5) * 0.25;
    vec3 base = vec3(0.6, 0.7, 0.76);
    vec3 light = vec3(0.82, 0.88, 0.92);
    gl_FragColor = vec4(mix(base, light, w), 1.0);
  }
`

function BasementWater() {
  const u = useRef({ uTime: { value: 0 } })
  useFrame(({ clock }) => { u.current.uTime.value = clock.getElapsedTime() })
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[40, 60]} />
      <shaderMaterial vertexShader={VS} fragmentShader={FS} uniforms={u.current} />
    </mesh>
  )
}

function BasementRoom() {
  return (
    <group>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 7, 0]}>
        <planeGeometry args={[20, 30]} />
        <meshLambertMaterial color='#1A1812' />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-9, 4, 0]}>
        <planeGeometry args={[30, 8]} />
        <meshLambertMaterial color='#222018' />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[9, 4, 0]}>
        <planeGeometry args={[30, 8]} />
        <meshLambertMaterial color='#1E1C16' />
      </mesh>
      {/* Back wall (behind viewer) */}
      <mesh position={[0, 4, 8]}>
        <planeGeometry args={[20, 8]} />
        <meshLambertMaterial color='#1A1812' />
      </mesh>
      {/* Stone arch opening to sea (forward) */}
      <mesh position={[0, 4, -14]}>
        <planeGeometry args={[20, 8]} />
        <meshLambertMaterial color='#0A0A08' />
      </mesh>
      {/* Arch frame */}
      <mesh position={[-5.5, 4, -13.8]}>
        <boxGeometry args={[1, 8, 0.5]} />
        <meshLambertMaterial color='#2A2820' />
      </mesh>
      <mesh position={[5.5, 4, -13.8]}>
        <boxGeometry args={[1, 8, 0.5]} />
        <meshLambertMaterial color='#2A2820' />
      </mesh>
      <mesh position={[0, 7.5, -13.8]}>
        <boxGeometry args={[12, 1.2, 0.5]} />
        <meshLambertMaterial color='#2A2820' />
      </mesh>
      {/* Stone steps up to house */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} position={[0, 0.5 + i * 0.55, 6 - i * 0.9]}>
          <boxGeometry args={[3, 0.5, 1]} />
          <meshLambertMaterial color='#302E28' />
        </mesh>
      ))}
      {/* Dock/jetty */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -6]}>
        <planeGeometry args={[3, 10]} />
        <meshLambertMaterial color='#2A2010' />
      </mesh>
      {/* Dock planks */}
      {[-4, -2, 0, 2, 4].map(z => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, z - 6]}>
          <planeGeometry args={[3, 0.06]} />
          <meshBasicMaterial color='#1A1808' />
        </mesh>
      ))}
    </group>
  )
}

// Orange canoe — Doig 100 Years Ago
function OrangeCanoe() {
  const figure = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (figure.current) {
      figure.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.06
    }
  })
  return (
    <Float speed={0.8} floatIntensity={0.3} floatingRange={[-0.1, 0.1]}>
      <group position={[2.5, 0.2, -3]} rotation={[0, -0.3, 0]}>
        {/* Long orange hull */}
        <mesh>
          <boxGeometry args={[8, 0.6, 1.8]} />
          <meshLambertMaterial color='#D04010' />
        </mesh>
        {/* Tapered ends */}
        <mesh position={[4.2, 0.1, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.9, 0.5, 1.6]} />
          <meshLambertMaterial color='#B03008' />
        </mesh>
        <mesh position={[-4.2, 0.1, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.9, 0.5, 1.6]} />
          <meshLambertMaterial color='#B03008' />
        </mesh>
        {/* Interior */}
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[7.5, 0.08, 1.5]} />
          <meshBasicMaterial color='#C03008' />
        </mesh>
        {/* Orange reflection on water */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.32, 0]}>
          <planeGeometry args={[8, 1.8]} />
          <meshBasicMaterial color='#C04018' transparent opacity={0.28} />
        </mesh>
        {/* Figure — seated, long hair (Doig style) */}
        <group ref={figure} position={[0.5, 0.65, 0]}>
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[0.6, 1.1, 0.55]} />
            <meshLambertMaterial color='#303838' />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.35, 10, 8]} />
            <meshLambertMaterial color='#C8A060' />
          </mesh>
          {/* Long hair */}
          <mesh position={[0, 1.1, -0.2]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.45, 1.0, 0.15]} />
            <meshLambertMaterial color='#C0A050' />
          </mesh>
        </group>
      </group>
    </Float>
  )
}

// Distant island on horizon (Doig 100 Years Ago)
function DistantIslandView() {
  return (
    <group position={[0, 1.5, -55]}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[28, 5, 3]} />
        <meshLambertMaterial color='#1A3C18' />
      </mesh>
      {[[-6, 2.2], [0, 2.5], [7, 2.0]].map(([x, h], i) => (
        <mesh key={i} position={[x, h + 2.5, 1.5]}>
          <boxGeometry args={[3.5, h as number, 1]} />
          <meshLambertMaterial color='#E0DCC8' />
        </mesh>
      ))}
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[26, 3, 2.5]} />
        <meshLambertMaterial color='#0E2810' />
      </mesh>
      {/* Soft glow around the island */}
      <pointLight position={[0, 4, 4]} color='#D8C890' intensity={1.2} distance={25} />
    </group>
  )
}

export default function BasementScene({ onExit }: { onExit: () => void }) {
  const mouse = useMouseNorm()

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 3, 6], fov: 65, near: 0.1, far: 200 }}
        gl={{ antialias: true }}
        style={{ background: '#0A0A08' }}
      >
        <ambientLight intensity={0.08} />
        <pointLight position={[0, 6, 0]} color='#A0988A' intensity={0.4} distance={20} />
        {/* Light from the arch opening */}
        <pointLight position={[0, 3, -12]} color='#98B0C0' intensity={1.2} distance={30} />

        <LookCamera mouse={mouse} />
        <BasementRoom />
        <BasementWater />
        <OrangeCanoe />
        <DistantIslandView />
      </Canvas>

      <button
        onClick={onExit}
        style={{
          position: 'absolute', top: 24, left: 24,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.6)',
          padding: '7px 22px', cursor: 'pointer',
          fontFamily: 'Georgia, serif', fontSize: '11px', letterSpacing: '4px',
        }}
      >
        ↑ back upstairs
      </button>

      <div style={{
        position: 'absolute', bottom: 24, width: '100%', textAlign: 'center',
        color: 'rgba(200,210,220,0.35)',
        fontFamily: 'Georgia, serif', fontSize: '11px', letterSpacing: '4px',
        pointerEvents: 'none',
      }}>
        the basement &nbsp;·&nbsp; move to look around
      </div>
    </div>
  )
}
