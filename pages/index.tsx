import HeroSection from "@components/HeroSection";
import AboutSection from "@components/AboutSection";
import ServicesSection from "@components/ServicesSection";
import PortfolioSection from "@components/PortfolioSection";
import CallToActionSection from "@components/CallToActionSection";
import RootLayout from './layout';

const Home = () => {
  return (
    <RootLayout>
      <div className="space-y-20">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection />
        <CallToActionSection
          title="Ready to Build Your Online Presence?"
          subtitle="Let's Build Something. Contact us today to get started!"
        />
      </div>
    </RootLayout>
  );
};

export default Home;