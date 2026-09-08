import { type NextRequest, NextResponse } from 'next/server';

import { getSession } from './shared/api/queries/auth-queries';

export default async function proxy(req: NextRequest) {
  const { session } = await getSession({ fetchOptions: { headers: req.headers } });

  if (session) return NextResponse.next();
  return NextResponse.redirect(new URL('/', req.nextUrl));
}

export const config = {
  matcher: ['/(profile.*)'],
};
