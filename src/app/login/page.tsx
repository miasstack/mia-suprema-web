'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    }).catch(() => null)
    if (res?.ok) {
      router.push('/chat')
      router.refresh()
    } else {
      setError('Wrong password.')
      setBusy(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-xs space-y-4 font-mono">
        <div className="text-center space-y-1">
          <div className="mx-auto w-10 h-10 rounded bg-hermes-accent flex items-center justify-center text-lg font-bold text-white">
            H
          </div>
          <h1 className="text-lg font-semibold text-hermes-text">Hermes</h1>
          <p className="text-xs text-hermes-text-dim">Private — enter your password</p>
        </div>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-hermes-surface border border-hermes-border rounded px-3 py-2 text-sm text-hermes-text outline-none focus:border-hermes-gold"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="w-full bg-hermes-accent text-white rounded px-3 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {busy ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  )
}
