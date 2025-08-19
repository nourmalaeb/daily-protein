import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith('/manifest') ||
    request.nextUrl.pathname.endsWith('.mp3') ||
    request.nextUrl.pathname.endsWith('.wav')
  ) {
    const response = NextResponse.next();
    response.headers.set(
      'Cache-Control',
      `public, max-age=315360000, immutable`
    );
    return response;
  }
  // update user's auth session
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav)$).*)',
  ],
};
