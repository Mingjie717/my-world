'use client'

import { useState } from 'react'
import World from '@/components/World'
import HouseInterior from '@/components/HouseInterior'

type Scene = 'exterior' | 'interior' | 'underwater' | 'forest'

export default function Home() {
  const [scene, setScene] = useState<Scene>('exterior')

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {scene === 'exterior' && (
        <World
          onEnterHouse={() => setScene('interior')}
          onDive={() => setScene('underwater')}
          onRowToForest={() => setScene('forest')}
        />
      )}

      {scene === 'interior' && (
        <HouseInterior onExit={() => setScene('exterior')} />
      )}

      {scene === 'underwater' && (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            background: '#2A5878',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#A8D8F0',
            fontFamily: 'Georgia, serif',
          }}
        >
          <p style={{ fontSize: '22px', letterSpacing: '4px', opacity: 0.7 }}>
            ~ underwater ~
          </p>
          <p style={{ marginTop: '16px', opacity: 0.4, fontSize: '13px' }}>
            coming soon
          </p>
          <button
            onClick={() => setScene('exterior')}
            style={{
              marginTop: '40px',
              background: 'none',
              border: '1px solid #A8D8F0',
              color: '#A8D8F0',
              padding: '10px 28px',
              cursor: 'pointer',
              letterSpacing: '3px',
              fontSize: '12px',
            }}
          >
            SURFACE
          </button>
        </div>
      )}

      {scene === 'forest' && (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            background: '#4A7050',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C8E0B8',
            fontFamily: 'Georgia, serif',
          }}
        >
          <p style={{ fontSize: '22px', letterSpacing: '4px', opacity: 0.7 }}>
            ~ forest island ~
          </p>
          <p style={{ marginTop: '16px', opacity: 0.4, fontSize: '13px' }}>
            coming soon
          </p>
          <button
            onClick={() => setScene('exterior')}
            style={{
              marginTop: '40px',
              background: 'none',
              border: '1px solid #C8E0B8',
              color: '#C8E0B8',
              padding: '10px 28px',
              cursor: 'pointer',
              letterSpacing: '3px',
              fontSize: '12px',
            }}
          >
            ROW BACK
          </button>
        </div>
      )}
    </main>
  )
}
