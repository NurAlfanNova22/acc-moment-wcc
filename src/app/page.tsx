import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import PricingSection from "@/components/sections/PricingSection";
import ScheduleSection from "@/components/sections/ScheduleSection";
import BookingSection from "@/components/sections/BookingSection";
import Footer from "@/components/Footer";
import MobileBottomBar from "@/components/MobileBottomBar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pb-16 md:pb-0">
        <HeroSection />
        <PortfolioSection />
        <PricingSection />
        <ScheduleSection />
        <BookingSection />
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
