import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { StatsRow } from '../components/StatsRow';
import { DataTable } from '../components/DataTable';
import { Footer } from '../components/Footer';
import { MobileBottomNav } from '../components/MobileBottomNav';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1F2937]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <HeroSection />
      <StatsRow />
      <DataTable />
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
