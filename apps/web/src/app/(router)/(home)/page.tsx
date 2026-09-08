import { Hero } from '@/widgets/hero';
import NewAdsSection from './_new-ads/page';

function Page() {
  return (
    <>
      <Hero />
      <section className="container my-4">
        <NewAdsSection />
      </section>
    </>
  );
}

export default Page;
