
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface CategoryPageLayoutProps {
  children: React.ReactNode;
}

export function CategoryPageLayout({ children }: CategoryPageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
