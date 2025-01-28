import Head from 'next/head';
import HeroSection from "@components/HeroSection";
import AboutSection from "@components/AboutSection";
import ServicesSection from "@components/ServicesSection";
import PortfolioSection from "@components/PortfolioSection";
import CallToActionSection from "@components/CallToActionSection";
import RootLayout from './layout';
import CanonicalURL from '@components/CanonicalURL';
import { NextSeo } from 'next-seo';
import SEO from '../next-seo.config';

const Home = () => {
  return (
    <RootLayout>
      <NextSeo {...SEO} />
      <Head>
        <title>Home - Noetics Web and Software Optimization</title>
        <meta name="description" content="About Noetic Software Services - Software Solutions, Web Apps, Sites, and Marketing." />
      </Head>
      <CanonicalURL url="https://noetics.io" />
      <div className="space-y-20">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection />
        <CallToActionSection />
      </div>
    </RootLayout>
  );
};

export default Home;