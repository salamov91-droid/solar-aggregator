import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import CatalogClient from '@/app/components/catalog-client';
import { getSolutions } from '@/lib/solutions';

export default async function CatalogPage() {
  const solutions = await getSolutions();

  return (
    <div className="page">
      <Header />
      <main className="container">
        <CatalogClient solutions={solutions} />
      </main>
      <Footer />
    </div>
  );
}
