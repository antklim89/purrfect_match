import { UserInfoSchema } from '@purrfect_match/shared/entities/auth/schema';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { UserInfoUpdateCard } from '@/features/user-info-update';
import { authClient } from '@/shared/lib/auth-client';
import { ErrorComponent } from '@/shared/ui/error-component';

export default async function Page() {
  const { data, error } = await authClient.getSession({ fetchOptions: { headers: await headers() } });
  if (error) return <ErrorComponent {...error} />;
  if (!data?.user) return redirect('/');

  const { data: userData, success } = await UserInfoSchema.safeParseAsync(data.user);
  if (!success) return <ErrorComponent message="Failed to receive user info." type="unexpected" />;

  return <UserInfoUpdateCard user={userData} />;
}
