import type { Viewport } from 'next'
import StudioClient from '@/components/StudioClient'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function StudioPage() {
  return <StudioClient />
}
