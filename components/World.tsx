'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
// Float and Stars from drei removed — replaced with pure R3F to avoid webpack chunk errors
import * as THREE from 'three'

// ─── PALETTE (from painting references) ──────────────────────────────────────
const P = {
  // Cézanne sky
  skyDay: '#7894A8',
  skyHorizon: '#A8BAC4',
  // Avery White Moon sky
  skyNight: '#0A1238',
  skyNightMid: '#16204A',
  nightCloud: '#2A48B0',
  // Avery sea (day) — vivid cobalt
  oceanDay: '#2058A0',
  waveDay: '#E0EEF8',
  // Avery White Moon (night) — dark purple-black
  oceanNight: '#080618',
  oceanNightPurple: '#180E2A',
  moonColor: '#F8F8F2',
  moonReflect: '#B8CEDE',
  // Avery sun
  sunColor: '#F2D46A',
  sunGlow: '#F8E8A8',
  // Cézanne/Avery — island & house
  islandSand: '#D4A840',
  islandSandDark: '#B88A28',
  islandStone: '#A88858',
  islandStoneDark: '#7A6038',
  houseCream: '#E8C49A',
  houseTop: '#D8B480',
  houseSide: '#C4A070',
  roofTile: '#C47850',    // Cézanne terracotta
  roofSide: '#9A5030',
  towerCream: '#DEB888',
  doorBrown: '#7A5030',
  windowGlow: '#F0E8C0',
  pathStone: '#C8B080',
  // Cézanne tree greens on island
  islandTree: '#2A5030',
  islandTreeLight: '#4A7840',
  // Doig forest island
  forestBase: '#3A5830',
  forestDeep: '#0A1A0A',
  forestDark: '#162A18',
  forestMid: '#1E3E22',
  forestGlow: '#7A9E28',
  // Doig spearfishing — green boat
  boatGreen: '#1E7828',
  boatGreenDark: '#145A1E',
  boatRim: '#E0DCCA',
  figureOrange: '#D05010',
  // Doig 100 Years Ago — orange canoe, pale water
  canoeOrange: '#D04010',
  basementWater: '#98B0C0',
  distantIslandGreen: '#1A3C18',
  distantBuilding: '#E0DCC8',
  // Cloud
  cloudDay: '#EAE6DA',
}

// ─── SHARED HOOKS ─────────────────────────────────────────────────────────────

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

function useCursorPointer() {
  return {
    onPointerOver: () => { document.body.style.cursor = 'pointer' },
    onPointerOut: () => { document.body.style.cursor = 'auto' },
  }
}

// ─── CAMERA PARALLAX ─────────────────────────────────────────────────────────

function ParallaxCamera({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree()
  useFrame(() => {
    camera.position.x += (mouse.current.x * 4 - camera.position.x) * 0.035
    camera.position.y += (mouse.current.y * 2 + 6 - camera.position.y) * 0.035
    camera.lookAt(0, 1.5, 0)
  })
  return null
}

// ─── SKY ─────────────────────────────────────────────────────────────────────

function Sky({ isNight }: { isNight: boolean }) {
  return (
    <mesh>
      <sphereGeometry args={[140, 24, 12]} />
      <meshBasicMaterial color={isNight ? P.skyNight : P.skyDay} side={THREE.BackSide} />
    </mesh>
  )
}

function Horizon({ isNight }: { isNight: boolean }) {
  return (
    <mesh position={[0, -5, -50]} rotation={[-0.08, 0, 0]}>
      <planeGeometry args={[280, 22]} />
      <meshBasicMaterial color={isNight ? '#101A3A' : P.skyHorizon} />
    </mesh>
  )
}

// ─── SUN / MOON ───────────────────────────────────────────────────────────────

function CelestialBody({ isNight }: { isNight: boolean }) {
  if (isNight) {
    return (
      <group position={[14, 20, -45]}>
        <mesh>
          <sphereGeometry args={[3.2, 20, 16]} />
          <meshBasicMaterial color={P.moonColor} />
        </mesh>
        <mesh position={[0, 0, -0.5]}>
          <sphereGeometry args={[4.2, 20, 16]} />
          <meshBasicMaterial color='#C8D8E8' transparent opacity={0.12} />
        </mesh>
      </group>
    )
  }
  return (
    <group position={[20, 18, -45]}>
      <mesh>
        <sphereGeometry args={[3.8, 20, 16]} />
        <meshBasicMaterial color={P.sunColor} />
      </mesh>
      <mesh position={[0, 0, -0.5]}>
        <sphereGeometry args={[5.5, 20, 16]} />
        <meshBasicMaterial color={P.sunGlow} transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

// ─── CLOUDS ───────────────────────────────────────────────────────────────────

function DayCloud({ x, y, z, s = 1, speed = 0.05, offset = 0 }: { x: number; y: number; z: number; s?: number; speed?: number; offset?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.x = x + Math.sin(clock.getElapsedTime() * speed + offset) * 2.5
  })
  return (
    <group ref={ref} position={[x, y, z]} scale={s}>
      <mesh><sphereGeometry args={[2.8, 10, 7]} /><meshBasicMaterial color={P.cloudDay} /></mesh>
      <mesh position={[3, -0.4, 0]}><sphereGeometry args={[2, 10, 7]} /><meshBasicMaterial color={P.cloudDay} /></mesh>
      <mesh position={[-2.5, -0.5, 0]}><sphereGeometry args={[1.8, 10, 7]} /><meshBasicMaterial color={P.cloudDay} /></mesh>
      <mesh position={[1, 1.2, 0]}><sphereGeometry args={[1.4, 8, 6]} /><meshBasicMaterial color={P.cloudDay} /></mesh>
    </group>
  )
}

function NightCloud({ x, y, z, w = 9, h = 3.5 }: { x: number; y: number; z: number; w?: number; h?: number }) {
  return (
    <mesh position={[x, y, z]}>
      <boxGeometry args={[w, h, 0.8]} />
      <meshBasicMaterial color={P.nightCloud} />
    </mesh>
  )
}

function Clouds({ isNight }: { isNight: boolean }) {
  if (isNight) return (
    <group>
      <NightCloud x={-20} y={22} z={-40} w={11} h={4} />
      <NightCloud x={-9} y={25} z={-44} w={7} h={3} />
      <NightCloud x={4} y={21} z={-38} w={9} h={3.5} />
      <NightCloud x={28} y={18} z={-42} w={6} h={2.5} />
    </group>
  )
  return (
    <group>
      <DayCloud x={-20} y={15} z={-32} s={1.3} speed={0.042} offset={0} />
      <DayCloud x={10} y={17} z={-42} s={0.75} speed={0.058} offset={2.1} />
      <DayCloud x={-6} y={19} z={-50} s={0.6} speed={0.035} offset={4.4} />
    </group>
  )
}

// ─── OCEAN (Avery swirling waves — animated strips, no custom shader) ────────

function WaveStrip({ z, phase, isNight }: { z: number; phase: number; isNight: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x = Math.sin(clock.getElapsedTime() * 0.18 + phase) * 28
      ref.current.position.z = z + Math.cos(clock.getElapsedTime() * 0.12 + phase) * 5
    }
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, Math.PI * 0.08 * (phase % 3 - 1)]} position={[0, -2.75, z]}>
      <planeGeometry args={[55, 0.9]} />
      <meshBasicMaterial
        color={isNight ? '#1A1030' : P.waveDay}
        transparent
        opacity={isNight ? 0.25 : 0.38}
      />
    </mesh>
  )
}

function Ocean({ isNight, onDive }: { isNight: boolean; onDive: () => void }) {
  const matRef = useRef<THREE.MeshLambertMaterial>(null)
  const pointer = useCursorPointer()
  const wavePhases = [0, 1.1, 2.2, 3.3, 4.4, 5.5, 6.6, 7.7, 8.8]

  useFrame(() => {
    if (matRef.current) {
      matRef.current.color.set(isNight ? P.oceanNight : P.oceanDay)
    }
  })

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.82, 0]} onClick={onDive} {...pointer}>
        <planeGeometry args={[220, 220]} />
        <meshLambertMaterial ref={matRef} color={isNight ? P.oceanNight : P.oceanDay} />
      </mesh>
      {wavePhases.map((phase, i) => (
        <WaveStrip key={i} z={-20 + i * 8} phase={phase} isNight={isNight} />
      ))}
    </group>
  )
}

function MoonReflection() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[9, -2.7, -14]}>
      <planeGeometry args={[1.8, 30]} />
      <meshBasicMaterial color={P.moonReflect} transparent opacity={0.38} />
    </mesh>
  )
}

// ─── MAIN ISLAND ──────────────────────────────────────────────────────────────

function MainIsland() {
  return (
    <group position={[0, -2.8, 0]}>
      {/* Sandy top (Avery golden sand) */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[7.8, 6.8, 1.5, 11]} />
        <meshLambertMaterial color={P.islandSand} />
      </mesh>
      {/* Stone base */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[6.8, 4.5, 3.5, 9]} />
        <meshLambertMaterial color={P.islandStone} />
      </mesh>
      {/* Tapered underside */}
      <mesh position={[0, -3, 0]}>
        <cylinderGeometry args={[4.5, 0.8, 4.5, 7]} />
        <meshLambertMaterial color={P.islandStoneDark} />
      </mesh>
      {/* Small trees (Cézanne deep green) */}
      {[[-5, 2.5, -2], [5.5, 2, 1], [-4, 2, 3]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 1.5, 0]}>
            <coneGeometry args={[1.2, 3, 7]} />
            <meshLambertMaterial color={i === 1 ? P.islandTreeLight : P.islandTree} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.18, 0.22, 1, 5]} />
            <meshLambertMaterial color={P.islandStoneDark} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ─── HOUSE (Monument Valley geometry) ────────────────────────────────────────

function House({ onClick }: { onClick: () => void }) {
  const pointer = useCursorPointer()
  return (
    <group position={[0, -1.2, 0]}>
      {/* Ground platform */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[9, 0.5, 4]} />
        <meshLambertMaterial color={P.pathStone} />
      </mesh>

      {/* Tower (left) */}
      <mesh position={[-3, 4.8, 0]}>
        <boxGeometry args={[2.4, 8, 2.4]} />
        <meshLambertMaterial color={P.towerCream} />
      </mesh>
      {/* Tower — side face (darker) */}
      <mesh position={[-1.9, 4.8, 0.1]}>
        <boxGeometry args={[0.2, 8, 2.2]} />
        <meshLambertMaterial color={P.houseSide} />
      </mesh>
      {/* Tower roof */}
      <mesh position={[-3, 9.1, 0]}>
        <boxGeometry args={[2.8, 0.55, 2.8]} />
        <meshLambertMaterial color={P.roofTile} />
      </mesh>
      {/* Tower battlements */}
      {[-0.9, 0, 0.9].map(i => (
        <mesh key={i} position={[-3 + i * 0.9, 9.65, 1.05]}>
          <boxGeometry args={[0.55, 0.65, 0.38]} />
          <meshLambertMaterial color={P.towerCream} />
        </mesh>
      ))}
      {/* Tower window */}
      <mesh position={[-3, 5.5, 1.22]}>
        <planeGeometry args={[0.9, 1.2]} />
        <meshBasicMaterial color={P.windowGlow} />
      </mesh>
      <mesh position={[-3, 3.2, 1.22]}>
        <planeGeometry args={[0.9, 1.0]} />
        <meshBasicMaterial color={P.windowGlow} />
      </mesh>

      {/* Main building */}
      <mesh position={[1.8, 3.2, 0]}>
        <boxGeometry args={[5.5, 5.5, 3.2]} />
        <meshLambertMaterial color={P.houseCream} />
      </mesh>
      {/* Side face */}
      <mesh position={[4.65, 3.2, 0.1]}>
        <boxGeometry args={[0.2, 5.5, 3]} />
        <meshLambertMaterial color={P.houseSide} />
      </mesh>
      {/* Top face highlight */}
      <mesh position={[1.8, 6.05, 0]}>
        <boxGeometry args={[5.5, 0.15, 3.2]} />
        <meshLambertMaterial color={P.houseTop} />
      </mesh>
      {/* Main roof */}
      <mesh position={[1.8, 6.42, 0]}>
        <boxGeometry args={[5.9, 0.6, 3.6]} />
        <meshLambertMaterial color={P.roofTile} />
      </mesh>
      {/* Roof top face */}
      <mesh position={[2.3, 6.75, 0.1]} rotation={[0, 0.08, 0]}>
        <boxGeometry args={[5.8, 0.2, 3.4]} />
        <meshLambertMaterial color={P.roofSide} />
      </mesh>

      {/* Windows — main building */}
      <mesh position={[0.3, 3.8, 1.62]}>
        <planeGeometry args={[1.3, 1.5]} />
        <meshBasicMaterial color={P.windowGlow} />
      </mesh>
      <mesh position={[2.2, 3.8, 1.62]}>
        <planeGeometry args={[1.3, 1.5]} />
        <meshBasicMaterial color={P.windowGlow} />
      </mesh>
      <mesh position={[3.8, 3.8, 1.62]}>
        <planeGeometry args={[1.1, 1.5]} />
        <meshBasicMaterial color={P.windowGlow} />
      </mesh>
      {/* Upper windows */}
      <mesh position={[0.8, 5.2, 1.62]}>
        <planeGeometry args={[1.0, 0.8]} />
        <meshBasicMaterial color={P.windowGlow} />
      </mesh>
      <mesh position={[3.0, 5.2, 1.62]}>
        <planeGeometry args={[1.0, 0.8]} />
        <meshBasicMaterial color={P.windowGlow} />
      </mesh>

      {/* Door (arched via overlapping boxes) */}
      <mesh position={[1.2, 1.6, 1.62]}>
        <planeGeometry args={[1.4, 2.5]} />
        <meshBasicMaterial color={P.doorBrown} />
      </mesh>
      <mesh position={[1.2, 2.95, 1.63]}>
        <sphereGeometry args={[0.7, 8, 6, 0, Math.PI]} />
        <meshBasicMaterial color={P.doorBrown} />
      </mesh>

      {/* Chimney */}
      <mesh position={[3.5, 7.2, 0.5]}>
        <boxGeometry args={[0.65, 1.6, 0.65]} />
        <meshLambertMaterial color={P.islandStone} />
      </mesh>
      <mesh position={[3.5, 8.1, 0.5]}>
        <boxGeometry args={[0.85, 0.22, 0.85]} />
        <meshLambertMaterial color={P.roofSide} />
      </mesh>

      {/* Steps wrapping around (Monument Valley impossible staircase) */}
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={i} position={[0.5, -0.2 + i * 0.45, 2.1 + i * 0.55]}>
          <boxGeometry args={[3.5, 0.42, 0.9]} />
          <meshLambertMaterial color={P.pathStone} />
        </mesh>
      ))}
      {/* Steps side — impossible wrap (steps continue along side) */}
      {[0, 1, 2].map(i => (
        <mesh key={i} position={[-1.55, 0.6 + i * 0.45, 1.5 - i * 0.4]}>
          <boxGeometry args={[0.9, 0.42, 0.7]} />
          <meshLambertMaterial color={P.pathStone} />
        </mesh>
      ))}

      {/* Invisible click target */}
      <mesh onClick={onClick} {...pointer}>
        <boxGeometry args={[10, 12, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

// ─── FOREST ISLAND (Peter Doig) ───────────────────────────────────────────────

function ForestIsland({ onClick }: { onClick: () => void }) {
  const pointer = useCursorPointer()
  const trees: [number, number, number, number][] = [
    [-2.5, 5.5, -1, 2.2], [0, 7.5, 0.5, 2.8], [2.8, 6, 1.2, 2.4],
    [-1.2, 4.5, 2, 2.0], [1.5, 6.5, -1.5, 2.5], [0.5, 5, -2.5, 2.0],
    [-3, 4, 0.5, 1.8], [3, 5, -0.5, 2.1],
  ]
  return (
    <group position={[17, -2.8, -13]}>
      {/* Island base */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[5.5, 4.5, 2.2, 9]} />
        <meshLambertMaterial color={P.forestBase} />
      </mesh>
      {/* Trees */}
      {trees.map(([x, h, z, r], i) => (
        <group key={i} position={[x, 1.8, z]}>
          <mesh position={[0, h / 2, 0]}>
            <coneGeometry args={[r, h, 7]} />
            <meshLambertMaterial color={i % 3 === 0 ? P.forestDeep : i % 3 === 1 ? P.forestDark : P.forestMid} />
          </mesh>
        </group>
      ))}
      {/* Doig luminous glow — warm light from within */}
      <pointLight position={[0, 5, 0]} color={P.forestGlow} intensity={3} distance={14} />
      <pointLight position={[0, 2, 0]} color='#304820' intensity={1.5} distance={10} />
      {/* Click zone */}
      <mesh onClick={onClick} {...pointer}>
        <cylinderGeometry args={[7, 6, 16, 9]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

// ─── STAR FIELD (replaces drei Stars) ────────────────────────────────────────

function StarField() {
  const ref = useRef<THREE.Points>(null)
  const count = 900
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 80 + Math.random() * 30
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 5
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  }
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#E8F0FF" size={0.35} sizeAttenuation />
    </points>
  )
}

// ─── FLOAT BOB (replaces drei Float) ─────────────────────────────────────────

function FloatBob({ children, baseY = 0 }: { children: React.ReactNode; baseY?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = baseY + Math.sin(clock.getElapsedTime() * 1.2) * 0.22
    }
  })
  return <group ref={ref}>{children}</group>
}

// ─── BOAT (Doig Spearfishing — green + orange figure) ────────────────────────

function Boat({ onClick }: { onClick: () => void }) {
  const pointer = useCursorPointer()
  return (
    <FloatBob baseY={-2.2}>
      <group position={[-11, 0, 4]} rotation={[0, 0.35, 0]} onClick={onClick} {...pointer}>
        {/* Hull — long green canoe shape */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.5, 0.9, 2.2]} />
          <meshLambertMaterial color={P.boatGreen} />
        </mesh>
        {/* Hull curved ends */}
        <mesh position={[2.8, 0.25, 0]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.8, 0.6, 2]} />
          <meshLambertMaterial color={P.boatGreenDark} />
        </mesh>
        <mesh position={[-2.8, 0.25, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.8, 0.6, 2]} />
          <meshLambertMaterial color={P.boatGreenDark} />
        </mesh>
        {/* Interior cream strip */}
        <mesh position={[0, 0.46, 0]}>
          <boxGeometry args={[5.1, 0.1, 1.8]} />
          <meshBasicMaterial color={P.boatRim} />
        </mesh>
        {/* Orange figure — body */}
        <mesh position={[-0.5, 1.4, 0]}>
          <boxGeometry args={[0.75, 1.9, 0.75]} />
          <meshLambertMaterial color={P.figureOrange} />
        </mesh>
        {/* Head */}
        <mesh position={[-0.5, 2.55, 0]}>
          <sphereGeometry args={[0.42, 10, 8]} />
          <meshLambertMaterial color={P.figureOrange} />
        </mesh>
        {/* Spear */}
        <mesh position={[-0.2, 1.8, 0.6]} rotation={[0.3, 0, -0.2]}>
          <cylinderGeometry args={[0.04, 0.04, 3.5, 5]} />
          <meshBasicMaterial color='#C8C0A0' />
        </mesh>
      </group>
    </FloatBob>
  )
}

// ─── DISTANT ISLAND (Doig 100 Years Ago — glimpsed on horizon) ───────────────

function DistantIsland() {
  return (
    <group position={[0, -1, -85]}>
      {/* Island mass */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[22, 5, 4]} />
        <meshLambertMaterial color={P.distantIslandGreen} />
      </mesh>
      {/* White buildings peeking through */}
      {[-4, 0, 5].map((x, i) => (
        <mesh key={i} position={[x, 2.5, 2]}>
          <boxGeometry args={[3, 2, 1]} />
          <meshLambertMaterial color={P.distantBuilding} />
        </mesh>
      ))}
      {/* Tree canopy on top */}
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[20, 3, 3]} />
        <meshLambertMaterial color='#0E2810' />
      </mesh>
    </group>
  )
}

// ─── WORLD COMPONENT ─────────────────────────────────────────────────────────

interface WorldProps {
  onEnterHouse: () => void
  onDive: () => void
  onRowToForest: () => void
  onBasement: () => void
}

export default function World({ onEnterHouse, onDive, onRowToForest, onBasement }: WorldProps) {
  const [isNight, setIsNight] = useState(false)
  const mouse = useMouseNorm()

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 6, 20], fov: 50, near: 0.1, far: 350 }}
        gl={{ antialias: true }}
        style={{ background: isNight ? P.skyNight : P.skyDay }}
      >
        <ambientLight intensity={isNight ? 0.12 : 0.65} />
        <directionalLight
          position={[12, 22, 6]}
          intensity={isNight ? 0.08 : 0.75}
          color={isNight ? '#7088C0' : '#FFF2D8'}
        />
        <pointLight position={[-8, 10, 8]} intensity={isNight ? 0 : 0.3} color='#FFE8C0' />

        <ParallaxCamera mouse={mouse} />
        <Sky isNight={isNight} />
        <Horizon isNight={isNight} />
        <CelestialBody isNight={isNight} />
        <Clouds isNight={isNight} />
        {isNight && <StarField />}

        <Ocean isNight={isNight} onDive={onDive} />
        {isNight && <MoonReflection />}

        <MainIsland />
        <House onClick={onEnterHouse} />
        <ForestIsland onClick={onRowToForest} />
        <Boat onClick={onRowToForest} />
        <DistantIsland />
      </Canvas>

      {/* Day / Night toggle */}
      <button
        onClick={() => setIsNight(n => !n)}
        style={{
          position: 'absolute', top: 24, right: 24,
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.28)',
          color: 'rgba(255,255,255,0.8)',
          padding: '7px 22px',
          cursor: 'pointer',
          fontFamily: 'Georgia, serif',
          fontSize: '11px',
          letterSpacing: '4px',
          backdropFilter: 'blur(6px)',
          borderRadius: '1px',
          transition: 'all 0.3s',
        }}
      >
        {isNight ? 'day' : 'night'}
      </button>

      {/* Hints */}
      <div style={{
        position: 'absolute', bottom: '18%', width: '100%',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.32)',
        fontFamily: 'Georgia, serif',
        fontSize: '12px', letterSpacing: '4px',
        pointerEvents: 'none',
      }}>
        click the house &nbsp;·&nbsp; dive &nbsp;·&nbsp; row to the forest
      </div>
    </div>
  )
}
