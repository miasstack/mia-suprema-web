'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/chat')
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen bg-hermes-bg">
      <div className="text-center">
        <div className="text-2xl font-mono font-bold text-hermes-gold mb-2">HERMES</div>
        <div className="text-sm text-hermes-text-dim">Loading...</div>
      </div>
    </div>
  )
}
