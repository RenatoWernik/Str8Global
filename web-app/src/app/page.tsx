import { CursorFollower } from '@/components/animations/CursorFollower';
import {
  Hero,
  SelectedWorks,
  PortfolioGrid,
  HorizontalGallery,
  ClientsSection,
  Capabilities,
  Contact,
} from '@/components/sections';

export default function Home() {
  return (
    <main className="relative">
      <CursorFollower />
      <Hero />
      <SelectedWorks />
      <HorizontalGallery />
      <PortfolioGrid />
      <ClientsSection />
      <Capabilities />
      <Contact />
    </main>
  );
}
