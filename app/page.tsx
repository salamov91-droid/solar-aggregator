import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import HeroSection from '@/app/components/hero-section';
import StatsStrip from '@/app/components/stats-strip';
import ServicesSection from '@/app/components/services-section';
import PartnersSection from '@/app/components/partners-section';
import LeadSection from '@/app/components/lead-section';
import RecommendationWizard from '@/app/components/recommendation-wizard';
import { getSolutions } from '@/lib/solutions';

export default async function HomePage() {
  const solutions = await getSolutions();

  return (
    <div className="page">
      <Header />
      <main className="container">
        <HeroSection />
        <StatsStrip />
        <RecommendationWizard solutions={solutions} />
        <ServicesSection />
        <PartnersSection />
        <LeadSection />
      </main>
      <Footer />
    </div>
  );
}
