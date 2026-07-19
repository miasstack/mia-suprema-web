import { NextRequest, NextResponse } from 'next/server'

// Gate every route behind HERMES_WEB_PASSWORD.
// - Browser: login page sets an httpOnly cookie (sha256 of the password).
// - Agents (Claude, Codex, scripts): send `Authorization: Bearer <password>`.
// If HERMES_WEB_PASSWORD is unset (local dev), everything is open.
const PASSWORD = process.env.HERMES_WEB_PASSWORD || ''

async function cookieToken(password: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`hermes:${password}`))
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(req: NextRequest) {
  if (!PASSWORD) return NextResponse.next()

  const { pathname } = req.nextUrl
  if (pathname === '/login' || pathname === '/api/login') return NextResponse.next()

  const cookie = req.cookies.get('hermes_auth')?.value
  if (cookie && cookie === (await cookieToken(PASSWORD))) return NextResponse.next()

  const auth = req.headers.get('authorization')
  if (auth === `Bearer ${PASSWORD}`) return NextResponse.next()

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  // Protect everything except Next.js internals and static assets.
  matcher: ['/((?!_next/|favicon\\.ico|images/|css/|js/).*)'],
}
