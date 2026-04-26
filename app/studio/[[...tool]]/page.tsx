import type { Viewport } from 'next'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function StudioPage() {
  return <NextStudio config={config} />
}
