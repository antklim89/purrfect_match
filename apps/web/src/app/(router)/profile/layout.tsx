import { ProfileLayout } from '@/widgets/profile';

export default function Layout({ children }: LayoutProps<'/profile'>) {
  return <ProfileLayout>{children}</ProfileLayout>;
}
