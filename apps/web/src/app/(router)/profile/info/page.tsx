import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProfileUpdateCard } from '@/features/profile-update';
import { getSession } from '@/shared/api/queries/auth-queries';
import { userFindQuery } from '@/shared/api/queries/user-queries';
import { ErrorComponent } from '@/shared/ui/error-component';

export async function generateMetadata(): Promise<Metadata> {
  const { user } = await getSession();
  if (!user) return { title: 'You are not authenticated.' };

  const { data, error } = await userFindQuery({ userId: user.id });
  if (error) return { title: 'Error' };

  return {
    title: `${data.fullName || 'User'}'s Profile`,
    description: data.description,
  };
}

export default async function Page() {
  const { user } = await getSession();
  if (!user) return <ErrorComponent status={401} message="Authenticate to see this page." />;

  const { data, error } = await userFindQuery({ userId: user.id });
  if (error?.status === 404) notFound();
  if (error) return <ErrorComponent {...error} />;
  return <ProfileUpdateCard user={data} />;
}
