'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

type Scene = 'exterior' | 'interior' | 'basement' | 'underwater' | 'forest'

// Load 3D scenes client-only (no SSR — WebGL requires browser)
const World = dynamic(() => import('@/components/World'), { ssr: false })
const HouseInterior = dynamic(() => import('@/components/HouseInterior'), { ssr: false })
const BasementScene = dynamic(() => import('@/components/BasementScene'), { ssr: false })

function FadeOverlay({ visible }: { visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: '#0A0A08',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'all' : 'none',
      transition: 'opacity 0.55s ease',
    }} />
  )
}

function SimpleScene({ label, buttonLabel, onBack, bg }: {
  label: string; buttonLabel: string; onBack: () => void; bg: string
}) {
  return (
    <div style={{
      width: '100vw', height: '100vh', background: bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Georgia, serif',
    }}>
      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '20px', letterSpacing: '6px' }}>
        {label}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', marginTop: 12, letterSpacing: '2px' }}>
        coming soon
      </p>
      <button onClick={onBack} style={{
        marginTop: 48, background: 'none',
        border: '1px solid rgba(255,255,255,0.25)',
        color: 'rgba(255,255,255,0.6)',
        padding: '8px 28px', cursor: 'pointer',
        fontSize: '11px', letterSpacing: '4px',
        fontFamily: 'Georgia, serif',
      }}>
        {buttonLabel}
      </button>
    </div>
  )
}

export default function Home() {
  const [scene, setScene] = useState<Scene>('exterior')
  const [fading, setFading] = useState(false)

  const go = (next: Scene) => {
    setFading(true)
    setTimeout(() => { setScene(next); setFading(false) }, 560)
  }

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <FadeOverlay visible={fading} />

      {scene === 'exterior' && (
        <World
          onEnterHouse={() => go('interior')}
          onDive={() => go('underwater')}
          onRowToForest={() => go('forest')}
          onBasement={() => go('basement')}
        />
      )}

      {scene === 'interior' && (
        <HouseInterior
          onExit={() => go('exterior')}
          onBasement={() => go('basement')}
        />
      )}

      {scene === 'basement' && (
        <BasementScene onExit={() => go('interior')} />
      )}

      {scene === 'underwater' && (
        <SimpleScene
          label="~ underwater ~"
          buttonLabel="surface"
          onBack={() => go('exterior')}
          bg='#122038'
        />
      )}

      {scene === 'forest' && (
        <SimpleScene
          label="~ forest island ~"
          buttonLabel="row back"
          onBack={() => go('exterior')}
          bg='#0E1E10'
        />
      )}
    </main>
  )
}
