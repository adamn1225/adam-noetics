import HeroSection from "@components/HeroSection";
import AboutSection from "@components/AboutSection";
import ServicesSection from "@components/ServicesSection";
import PortfolioSection from "@components/PortfolioSection";
import CallToActionSection from "@components/CallToActionSection";
import RootLayout from './layout';
import AboutNoeticsDash from "@components/AboutNoeticsDash";

import { FC } from 'react';

const Home: FC = () => {
    return (
        <RootLayout>
            <div className="space-y-20">
                <HeroSection />
                <AboutNoeticsDash />
                <ServicesSection />
                <AboutSection />
                <PortfolioSection />
                <CallToActionSection
                    title="Ready for the next mission?"
                    subtitle="We have the skills, tools, focus, and intensity to ensure it's complete. Let's talk."
                />
            </div>
        </RootLayout>
    );
};

export default Home;