import HeroFeatures from "@/components/HeroFeatures";
import HeroSection from "@/components/HeroSection";
import HeroTesimonial from "@/components/HeroTesimonial";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import { Button } from "@/components/ui/button";

function Home() {
  return (
    <>
      <HeroSection />
      <Stats />
      <HeroFeatures />
      <HowItWorks />
      <HeroTesimonial />
    </>
  );
}

export default Home;
