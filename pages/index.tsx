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
                {/* <PortfolioSection /> */}
                <CallToActionSection
                    title="From Creation to Publishing—Automate Your Social Media Workflow"
                    subtitle="Stay Ahead of the Curve—Create, Automate, and Grow."
                />
            </div>
        </RootLayout>
    );
};

export default Home;