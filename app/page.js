import HeroFeatures from "@/components/HeroFeatures";
import HeroSection from "@/components/HeroSection";
import HeroTesimonial from "@/components/HeroTesimonial";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";

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
