import { type NextRequest, NextResponse } from 'next/server';

import { authClient } from './shared/lib/auth-client';

export default async function proxy(req: NextRequest) {
  const { data } = await authClient.getSession({ fetchOptions: { headers: req.headers } });

  if (data?.session) return NextResponse.next();
  return NextResponse.redirect(new URL('/', req.nextUrl));
}

export const config = {
  matcher: ['/(profile.*)'],
};
