import Navbar from "@/components/ui/navbar";
import HeroSection from "@/components/hero-section";
import StatsOverview from "@/components/stats-overview";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navbar />
      <HeroSection />
      <StatsOverview />
    </div>
  );
};

export default Index;
