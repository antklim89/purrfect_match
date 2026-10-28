export default function Layout({ children }: LayoutProps<'/animal/[animalName]'>) {
  return <div className="container my-4">{children}</div>;
}
