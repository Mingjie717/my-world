import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My World',
  description: 'A living, growing world of ideas, art, and stories.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
