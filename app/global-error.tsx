'use client'

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body style={{
        background: '#0A0A08',
        color: '#E8E0D0',
        fontFamily: 'Georgia, serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        margin: 0,
        padding: '24px',
        boxSizing: 'border-box',
      }}>
        <p style={{ fontSize: '13px', letterSpacing: '3px', opacity: 0.5, marginBottom: '32px' }}>
          something went wrong
        </p>
        <pre style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          padding: '20px 28px',
          borderRadius: '2px',
          fontSize: '12px',
          maxWidth: '680px',
          width: '100%',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          lineHeight: 1.7,
          opacity: 0.8,
        }}>
          {error?.message || String(error)}
          {'\n\n'}
          {error?.stack || ''}
        </pre>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '32px',
            background: 'none',
            border: '1px solid rgba(255,255,255,0.25)',
            color: 'rgba(255,255,255,0.6)',
            padding: '8px 28px',
            cursor: 'pointer',
            fontSize: '11px',
            letterSpacing: '4px',
            fontFamily: 'Georgia, serif',
          }}
        >
          try again
        </button>
      </body>
    </html>
  )
}
