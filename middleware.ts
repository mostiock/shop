// Instructions: Update the middleware to include profile page in protected routes.

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/account(.*)',
  '/orders(.*)',
  '/profile(.*)',
  '/dashboard(.*)'
])

const isAuthPage = createRouteMatcher([
  '/auth/signin',
  '/auth/signup'
])

export default clerkMiddleware(async (auth, req) => {
  // Redirect auth pages to home since we now use popups
  if (isAuthPage(req)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
