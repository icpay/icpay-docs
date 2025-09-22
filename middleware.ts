import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || 'local'
  const isStaging = appEnv === 'staging'
  const res = NextResponse.next()
  if (isStaging) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return res
}

export const config = {
  matcher: '/:path*',
}


