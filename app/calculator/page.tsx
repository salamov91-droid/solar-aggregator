import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import RecommendationWizard from '@/app/components/recommendation-wizard';
import { getSolutions } from '@/lib/solutions';

export default async function CalculatorPage() {
  const solutions = await getSolutions();

  return (
    <div className="page">
      <Header />
      <main className="container">
        <section className="hero hero--catalog">
          <span className="badge">Калькулятор</span>
          <h1>Подбор решения по параметрам объекта</h1>
          <p>Выберите тип объекта, наличие сети, задачу и профиль потребления — система предложит наилучший вариант и покажет подходящие позиции.</p>
        </section>
        <RecommendationWizard solutions={solutions} />
      </main>
      <Footer />
    </div>
  );
}
