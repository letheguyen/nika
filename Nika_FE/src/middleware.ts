import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { APP_PATHS, ROLES } from './constants'

export function middleware(request: NextRequest) {
  const userCookieData = process.env.NEXT_PUBLIC_COOKIE_USER_KEY ?? ''
  const userData = request.cookies.get(userCookieData)?.value

  const isNilDataUser = userData ? false : true
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname.startsWith('/auth')

  if (isAdminPage && userData) {
    const { role } = JSON.parse(userData)
    return String(role) && String(role) === String(ROLES.admin)
      ? NextResponse.next()
      : NextResponse.redirect(new URL(APP_PATHS.shop, request.url))
  }

  if (isAdminPage && isNilDataUser) {
    return NextResponse.redirect(new URL(APP_PATHS.shop, request.url))
  }

  if (isLoginPage && userData) {
    const { role } = JSON.parse(userData)
    const isRoleAdmin = String(role) && String(role) === String(ROLES.admin)

    return isRoleAdmin
      ? NextResponse.redirect(new URL(APP_PATHS.home, request.url))
      : NextResponse.redirect(new URL(APP_PATHS.shop, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
}
