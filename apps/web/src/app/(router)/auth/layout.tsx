export default function Layout({ children }: LayoutProps<'/auth'>) {
  return <div className="container flex h-full items-center justify-center">{children}</div>;
}
