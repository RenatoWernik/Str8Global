import { CursorFollower } from '@/components/animations/CursorFollower';
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
      <CursorFollower />
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
