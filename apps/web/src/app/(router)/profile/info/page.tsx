import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { ProfileUpdateCard } from '@/features/profile-update';
import { profileFindQuery } from '@/shared/api/queries/profile-queries';
import { ErrorComponent } from '@/shared/ui/error-component';

export async function generateMetadata(): Promise<Metadata> {
  const { data, error } = await profileFindQuery({ cookie: (await cookies()).toString() });
  if (error) return { title: 'Error' };

  return {
    title: `${data.fullName || 'User'}'s Profile`,
    description: data.description,
  };
}

export default async function Page() {
  const { data, error } = await profileFindQuery({ cookie: (await cookies()).toString() });
  if (error?.status === 404) notFound();
  if (error) return <ErrorComponent {...error} />;
  return <ProfileUpdateCard user={data} />;
}
