import {
  Hero,
  Services,
  SelectedWorks,
  HorizontalGallery,
  PortfolioGrid,
  Industries,
  ClientsSection,
  Capabilities,
  Contact,
} from '@/components/sections';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Services />
      <SelectedWorks />
      <HorizontalGallery />
      <PortfolioGrid />
      <Industries />
      <ClientsSection />
      <Capabilities />
      <Contact />
    </main>
  );
}
