'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { client, urlFor } from '@/lib/sanity'
import { allEntriesQuery } from '@/lib/queries'

// ─── PALETTE (user watercolor 1 — teal/mustard living room) ──────────────────
const IC = {
  floor: '#8B6040',
  floorDark: '#6A4828',
  wallTeal: '#2A8888',
  wallTealDark: '#1E6868',
  ceiling: '#D0BC9C',
  sofaMustard: '#C89030',
  sofaDark: '#A87020',
  sofaArm: '#906018',
  shelfWood: '#8B6040',
  shelfDark: '#6A4028',
  windowGlow: '#F8F2E0',
  windowFrame: '#8B6040',
  tvDark: '#202830',
  tvScreen: '#304050',
  tvOn: '#4A7888',
  plantGreen: '#4A7840',
  plantDark: '#2E5028',
  plantPot: '#C08050',
  doorWarm: '#C4A07A',
  doorFrame: '#8B6040',
  rugRed: '#A87060',
  bookColors: [
    '#C47850', '#7A8FA0', '#8AAF7E', '#D4A860',
    '#A07888', '#6A8888', '#C49060', '#7090A0',
    '#A88060', '#9080A8', '#70A878', '#C8906A',
  ],
  // Basement (Doig 100 Years Ago)
  basementWall: '#2A2820',
  basementWater: '#98B0C0',
  canoeOrange: '#D04010',
  distantGreen: '#1A3C18',
}

interface Entry {
  _id: string
  title: string
  entryType: 'book' | 'movie' | 'artwork' | 'photo' | 'thought' | 'character' | 'music'
  description?: string
  image?: { asset: { _ref: string } }
  date?: string
  tags?: string[]
}

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

// ─── CAMERA — mouse look-around ───────────────────────────────────────────────

function LookCamera({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree()
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))

  useFrame(() => {
    euler.current.y += (-mouse.current.x * 0.55 - euler.current.y) * 0.04
    euler.current.x += (mouse.current.y * 0.22 - euler.current.x) * 0.04
    euler.current.x = Math.max(-0.28, Math.min(0.28, euler.current.x))
    camera.rotation.copy(euler.current)
  })
  return null
}

// ─── ROOM SHELL ───────────────────────────────────────────────────────────────

function Room() {
  const W = 18, H = 8, D = 16
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshLambertMaterial color={IC.floor} />
      </mesh>
      {/* Floor boards suggestion */}
      {[-6, -3, 0, 3, 6].map(x => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 0]}>
          <planeGeometry args={[0.05, D]} />
          <meshBasicMaterial color={IC.floorDark} transparent opacity={0.25} />
        </mesh>
      ))}
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, D]} />
        <meshLambertMaterial color={IC.ceiling} />
      </mesh>
      {/* Back wall (teal) */}
      <mesh position={[0, H / 2, -D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshLambertMaterial color={IC.wallTeal} />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshLambertMaterial color={IC.wallTealDark} />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshLambertMaterial color={IC.wallTealDark} />
      </mesh>

      {/* Rug (terracotta) — circle scaled into oval */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 1]} scale={[1, 0.58, 1]}>
        <circleGeometry args={[5.5, 48]} />
        <meshBasicMaterial color={IC.rugRed} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 1]} scale={[1, 0.58, 1]}>
        <ringGeometry args={[4.2, 4.8, 48]} />
        <meshBasicMaterial color={IC.sofaDark} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

// ─── WINDOW (warm Avery light) ────────────────────────────────────────────────

function Window() {
  return (
    <group position={[1, 5, -7.9]}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[4, 3.5, 0.25]} />
        <meshLambertMaterial color={IC.windowFrame} />
      </mesh>
      {/* Glass — warm light */}
      <mesh position={[0, 0, 0.14]}>
        <planeGeometry args={[3.5, 3]} />
        <meshBasicMaterial color={IC.windowGlow} />
      </mesh>
      {/* Cross bars */}
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[0.08, 3, 0.04]} />
        <meshBasicMaterial color={IC.windowFrame} />
      </mesh>
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[3.5, 0.08, 0.04]} />
        <meshBasicMaterial color={IC.windowFrame} />
      </mesh>
      {/* Window sill */}
      <mesh position={[0, -1.9, 0.2]}>
        <boxGeometry args={[4.2, 0.2, 0.5]} />
        <meshLambertMaterial color={IC.windowFrame} />
      </mesh>
      {/* Warm light from window */}
      <pointLight position={[0, 0, 2]} color='#FFF2D8' intensity={2.5} distance={12} />
    </group>
  )
}

// ─── BOOKSHELF (left wall) ────────────────────────────────────────────────────

function Bookshelf({ books }: { books: Entry[] }) {
  const pointer = useCursorPointer()
  return (
    <group position={[-8.2, 0, -3]}>
      {/* Back panel */}
      <mesh position={[0.1, 3.8, 0]}>
        <boxGeometry args={[0.15, 7.2, 5.5]} />
        <meshLambertMaterial color={IC.shelfDark} />
      </mesh>
      {/* Side panels */}
      <mesh position={[0, 3.8, 2.85]}><boxGeometry args={[0.5, 7.2, 0.12]} /><meshLambertMaterial color={IC.shelfWood} /></mesh>
      <mesh position={[0, 3.8, -2.85]}><boxGeometry args={[0.5, 7.2, 0.12]} /><meshLambertMaterial color={IC.shelfWood} /></mesh>
      {/* Shelf boards */}
      {[1.0, 2.8, 4.5, 6.0].map(y => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[0.5, 0.12, 5.5]} />
          <meshLambertMaterial color={IC.shelfWood} />
        </mesh>
      ))}
      {/* Books */}
      {books.slice(0, 12).map((book, i) => {
        const row = Math.floor(i / 4)
        const col = i % 4
        const bz = -2 + col * 1.25
        const by = [1.5, 3.2, 4.95][row] ?? 1.5
        const bColor = IC.bookColors[i % IC.bookColors.length]
        return (
          <mesh
            key={book._id} position={[0.05, by + 0.55, bz]}
            {...pointer}
          >
            <boxGeometry args={[0.38, 1.1, 1.0]} />
            <meshLambertMaterial color={bColor} />
          </mesh>
        )
      })}
    </group>
  )
}

// ─── SOFA (Avery flat geometry, mustard) ──────────────────────────────────────

function Sofa() {
  return (
    <group position={[0, 0, -5]}>
      {/* Back */}
      <mesh position={[0, 2.1, -0.5]}>
        <boxGeometry args={[7, 2.2, 0.9]} />
        <meshLambertMaterial color={IC.sofaMustard} />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 1.1, 0.4]}>
        <boxGeometry args={[6.8, 0.7, 2.4]} />
        <meshLambertMaterial color={IC.sofaDark} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.35, 0.2]}>
        <boxGeometry args={[7, 0.55, 2.6]} />
        <meshLambertMaterial color={IC.sofaArm} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-3.6, 1.6, 0.2]}>
        <boxGeometry args={[0.7, 1.8, 2.6]} />
        <meshLambertMaterial color={IC.sofaArm} />
      </mesh>
      {/* Right arm */}
      <mesh position={[3.6, 1.6, 0.2]}>
        <boxGeometry args={[0.7, 1.8, 2.6]} />
        <meshLambertMaterial color={IC.sofaArm} />
      </mesh>
      {/* Cushion divider */}
      <mesh position={[0, 1.5, 0.2]}>
        <boxGeometry args={[0.1, 1.8, 2.4]} />
        <meshLambertMaterial color={IC.sofaMustard} />
      </mesh>
      {/* Legs */}
      {[[-3, 0], [3, 0], [-3, 0.8], [3, 0.8]].map(([x, zOff], i) => (
        <mesh key={i} position={[x, 0.1, -0.7 + zOff * 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.25, 5]} />
          <meshLambertMaterial color={IC.shelfDark} />
        </mesh>
      ))}
    </group>
  )
}

// ─── TV ───────────────────────────────────────────────────────────────────────

function TV({ movies }: { movies: Entry[]; onSelect: (e: Entry) => void }) {
  return (
    <group position={[7, 2.5, -5]}>
      {/* Cabinet */}
      <mesh position={[0, -1.8, 0]}>
        <boxGeometry args={[4, 0.5, 1.5]} />
        <meshLambertMaterial color={IC.shelfWood} />
      </mesh>
      {/* TV body */}
      <mesh>
        <boxGeometry args={[4.2, 2.5, 0.3]} />
        <meshLambertMaterial color={IC.tvDark} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.16]}>
        <planeGeometry args={[3.8, 2.2]} />
        <meshBasicMaterial color={movies.length > 0 ? IC.tvOn : IC.tvScreen} />
      </mesh>
      {/* Screen glow light */}
      {movies.length > 0 && (
        <pointLight position={[0, 0, 1.5]} color='#5A8898' intensity={0.8} distance={5} />
      )}
    </group>
  )
}

// ─── ARTWORK FRAMES ───────────────────────────────────────────────────────────

function ArtworkFrame({ x, y, z, art }: { x: number; y: number; z: number; art?: Entry }) {
  const pointer = useCursorPointer()
  return (
    <group position={[x, y, z]}>
      <mesh>
        <boxGeometry args={[2.8, 3.2, 0.15]} />
        <meshLambertMaterial color={IC.shelfDark} />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[2.4, 2.8]} />
        <meshBasicMaterial color={art ? '#D4C090' : '#C8B878'} />
      </mesh>
      {art && (
        <mesh position={[0, 0, 0.12]} {...pointer}>
          <planeGeometry args={[2.4, 2.8]} />
          <meshBasicMaterial color='#C8B070' transparent opacity={0.01} />
        </mesh>
      )}
    </group>
  )
}

// ─── PLANT ────────────────────────────────────────────────────────────────────

function Plant() {
  return (
    <group position={[-7, 0, 5]}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.45, 0.35, 1.1, 7]} />
        <meshLambertMaterial color={IC.plantPot} />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[1.1, 10, 8]} />
        <meshLambertMaterial color={IC.plantGreen} />
      </mesh>
      <mesh position={[-0.5, 2.4, 0.2]} rotation={[0.3, -0.5, 0.4]}>
        <sphereGeometry args={[0.7, 8, 6]} />
        <meshLambertMaterial color={IC.plantDark} />
      </mesh>
      <mesh position={[0.5, 2.3, -0.2]} rotation={[-0.2, 0.4, -0.3]}>
        <sphereGeometry args={[0.65, 8, 6]} />
        <meshLambertMaterial color={IC.plantGreen} />
      </mesh>
    </group>
  )
}

// ─── BASEMENT STAIRS (bottom left) ───────────────────────────────────────────

function BasementStairs({ onClick }: { onClick: () => void }) {
  const pointer = useCursorPointer()
  return (
    <group position={[-7, 0, 6]} onClick={onClick} {...pointer}>
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} position={[0, -i * 0.45, -i * 0.7]}>
          <boxGeometry args={[2.2, 0.45, 0.9]} />
          <meshLambertMaterial color={i % 2 === 0 ? IC.shelfWood : IC.shelfDark} />
        </mesh>
      ))}
      {/* Label on wall above stairs */}
      <mesh position={[0, 1.5, -0.2]}>
        <planeGeometry args={[1.8, 0.6]} />
        <meshBasicMaterial color={IC.wallTealDark} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

// ─── EXIT DOOR (right wall) ───────────────────────────────────────────────────

function ExitDoor({ onClick }: { onClick: () => void }) {
  const pointer = useCursorPointer()
  return (
    <group position={[8.8, 2, 2]} rotation={[0, -Math.PI / 2, 0]} onClick={onClick} {...pointer}>
      <mesh>
        <boxGeometry args={[3, 4.5, 0.2]} />
        <meshLambertMaterial color={IC.doorFrame} />
      </mesh>
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[2.6, 4.1, 0.1]} />
        <meshLambertMaterial color={IC.doorWarm} />
      </mesh>
      <mesh position={[-0.7, 0, 0.2]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshLambertMaterial color={IC.shelfWood} />
      </mesh>
    </group>
  )
}

// ─── INTERIOR SCENE ───────────────────────────────────────────────────────────

export default function HouseInterior({ onExit, onBasement }: { onExit: () => void; onBasement: () => void }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [selected, setSelected] = useState<Entry | null>(null)
  const mouse = useMouseNorm()

  useEffect(() => {
    client.fetch<Entry[]>(allEntriesQuery).then(setEntries).catch(() => {})
  }, [])

  const books = entries.filter(e => e.entryType === 'book' || e.entryType === 'thought')
  const movies = entries.filter(e => e.entryType === 'movie' || e.entryType === 'music')
  const artworks = entries.filter(e => e.entryType === 'artwork' || e.entryType === 'photo')

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 3, 7], fov: 65, near: 0.1, far: 100 }}
        gl={{ antialias: true }}
        style={{ background: '#2A8888' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 7, 0]} intensity={0.8} color='#FFF8E8' />
        <pointLight position={[-5, 5, 3]} intensity={0.5} color='#FFE8C0' />

        <LookCamera mouse={mouse} />

        <Room />
        <Window />
        <Bookshelf books={books} />
        <Sofa />
        <TV movies={movies} onSelect={setSelected} />

        {/* Artwork frames on back wall */}
        <ArtworkFrame x={-3.5} y={5} z={-7.85} art={artworks[0]} />
        <ArtworkFrame x={-0.5} y={5} z={-7.85} art={artworks[1]} />

        <Plant />
        <BasementStairs onClick={onBasement} />
        <ExitDoor onClick={onExit} />
      </Canvas>

      {/* UI overlay labels */}
      <div style={{
        position: 'absolute', bottom: 24, left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.35)',
        fontFamily: 'Georgia, serif', fontSize: '11px', letterSpacing: '4px',
        pointerEvents: 'none',
      }}>
        move to look around &nbsp;·&nbsp; click the door to go outside &nbsp;·&nbsp; stairs → basement
      </div>

      {/* Entry detail panel */}
      {selected && (
        <div
          style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(30,20,10,0.55)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              backgroundColor: '#F0E8D8', maxWidth: 500, width: '88%',
              padding: '2.8rem 3rem', borderRadius: '1px',
              fontFamily: 'Georgia, serif',
            }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{ color: '#A07850', fontSize: '10px', letterSpacing: '4px', marginBottom: 10, textTransform: 'uppercase' }}>
              {selected.entryType}
            </p>
            <h2 style={{ color: '#3A2818', fontSize: '26px', marginBottom: 14, lineHeight: 1.25, fontWeight: 'normal' }}>
              {selected.title}
            </h2>
            {selected.image && (
              <img src={urlFor(selected.image).width(460).url()} alt={selected.title}
                style={{ width: '100%', height: 200, objectFit: 'cover', marginBottom: 16 }} />
            )}
            {selected.description && (
              <p style={{ color: '#5A4030', fontSize: '15px', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                {selected.description}
              </p>
            )}
            {selected.date && <p style={{ color: '#A08060', fontSize: '12px', marginTop: 18 }}>{selected.date}</p>}
            <button onClick={() => setSelected(null)}
              style={{ marginTop: 22, background: 'none', border: 'none', color: '#A07850', fontSize: '11px', letterSpacing: '3px', cursor: 'pointer', textTransform: 'uppercase' }}>
              close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
