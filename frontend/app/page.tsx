import BuildDreamHouseSection from "@/components/langing/BuildDreamHouseSection";
import Footer from "@/components/langing/Footer";
import HeroSection from "@/components/langing/hero";
import LeadGenerationSection from "@/components/langing/LeadGenerationSection";
import PopularTrades from "@/components/langing/popular_trades";
import Section2 from "@/components/langing/section2";
import Section3 from "@/components/langing/section3";
import TopNav from "@/components/langing/top";
import Tradespeople from "@/components/langing/Tradespeople";

export default function Home() {
  return (
    <div className="text-black">
      <TopNav />
      <HeroSection />
      <Section2 />
      <PopularTrades />
      <Tradespeople />
      <Tradespeople />
      <Tradespeople />
      <Section3 />
      <BuildDreamHouseSection />
      <LeadGenerationSection />
      <Footer />
    </div>
  );
}
