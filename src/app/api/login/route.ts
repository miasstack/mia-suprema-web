import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'

const PASSWORD = process.env.HERMES_WEB_PASSWORD || ''

function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export async function POST(req: NextRequest) {
  if (!PASSWORD) return NextResponse.json({ ok: true })

  const body = await req.json().catch(() => null)
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!password || !safeEqual(password, PASSWORD)) {
    await new Promise((r) => setTimeout(r, 750))
    return NextResponse.json({ error: 'wrong password' }, { status: 401 })
  }

  const token = createHash('sha256').update(`hermes:${PASSWORD}`).digest('hex')
  const res = NextResponse.json({ ok: true })
  res.cookies.set('hermes_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return res
}
