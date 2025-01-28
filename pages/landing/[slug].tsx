import { useRouter } from "next/router";
import React from "react";
import Head from 'next/head';
import LandingNavigation from "@components/LandingNavigation";
import { motion } from "framer-motion";
import { fadeInUp } from "../../motionConfig";
import CallToActionSection from "@components/CallToActionSection";
import { NextSeo } from 'next-seo';
import CanonicalURL from '@components/CanonicalURL';

const services = [
    {
        slug: "noetic-web-apps",
        title: "Custom Web Apps",
        desc: "Tailored, Feature-Rich Platforms Built for You",
        howItWorks: "We design and develop custom web applications that simplify processes, boost productivity, and meet your specific business needs. Say goodbye to manual tasks and hello to automated, intuitive solutions.",
        whatWeOffer: [
            "Intuitive Interfaces: User-centric designs for effortless navigation.",
            "Scalable Architecture: Built to grow with your business.",
            "Custom Features: Tailored tools to fit your unique workflows.",
        ],
    },
    {
        slug: "noetic-marketing",
        title: "Noetic Marketing - SEO/SMM/PPC Advertising",
        desc: "Strategies to Help You Reach Your Target Audience",
        howItWorks: "We create marketing strategies that drive results. From SEO to PPC advertising, we help you reach your target audience and grow your business.",
        whatWeOffer: [
            "SMM/PPC Advertising: Reach your audience on social media and search engines.",
            "SEO: Improve your search engine rankings and drive organic traffic.",
            "Backlinking: Build high-quality backlinks to boost your site's authority.",
        ],
    },
    {
        slug: "noetic-custom-tools",
        title: "Custom Tools",
        desc: "Build Tools That Empower Your Team",
        howItWorks: "We design tools that solve real business challenges. By focusing on user needs, we create solutions that improve workflows and provide meaningful results.",
        whatWeOffer: [
            "Custom Calculators: Precise tools for unique calculations.",
            "Data Visualization: Transform data into actionable insights.",
            "Support Systems: Build directories, ticket systems, and chatbots.",
        ],
    },
    {
        slug: "noetic-api-integrations",
        title: "API Integrations",
        desc: "Seamless Connectivity for Smarter Operations",
        howItWorks: "We identify key connection points between platforms and create reliable, secure integrations. From real-time syncing to custom API solutions, we ensure seamless communication between systems.",
        whatWeOffer: [
            "Third-Party APIs: Integrate popular tools and services.",
            "Secure Connections: Safeguard data during transfers.",
            "Real-Time Sync: Keep everything up-to-date, always.",
        ],
    },
    {
        slug: "automation-and-web-scraping",
        title: "Noetic Automation & Web Scraping",
        desc: "Data Gathering for Smarter Decisions",
        howItWorks: "We build automated tools that scrape, extract, and organize data from websites in real-time. Whether you need competitor analysis, pricing insights, or industry trends, we’ll deliver actionable results.",
        whatWeOffer: [
            "Automated Scraping: Collect data without manual effort.",
            "Data Extraction: Pinpoint the exact information you need.",
            "Workflow Automation: Optimize and simplify processes.",
            "Task Scheduling: Automate reminders and deadlines.",
            "Custom Triggers: Automatically respond to critical actions.",
        ],
    },
    {
        slug: "noetic-chrome-extensions",
        title: "Chrome Extensions",
        desc: "Custom Browser Tools for Productivity",
        howItWorks: "Our team creates user-friendly extensions tailored to your workflow. We focus on solving pain points and adding valuable features that enhance your productivity.",
        whatWeOffer: [
            "Store Information: Keep key data at your fingertips.",
            "Advanced Bookmarking: Organize and retrieve pages effortlessly.",
            "Automate Tasks: Simplify repetitive browsing actions.",
        ],
    },
];

const LandingPage = () => {
    const router = useRouter();
    const { slug } = router.query;

    const service = services.find((s) => s.slug === slug);

    if (!service) {
        return <p className="text-center mt-20">Service not found</p>;
    }

    const customSEO = {
        title: `${service.title} - Noetic Software and Web Key Solutions`,
        description: service.desc,
        openGraph: {
            title: `${service.title} - Noetic Software and Web Key Solutions`,
            description: service.desc,
            url: `https://noetics.io/landing/${slug}`,
        },
    };

    return (
        <>
            <NextSeo {...customSEO} />
            <Head>
                <title>{service.title} - Noetic Software and Web Key Solutions</title>
                <meta name="description" content={service.desc} />
            </Head>
            <CanonicalURL url={`https://noetics.io/landing/${slug}`} />
            <LandingNavigation />
            <motion.section
                className="bg-white text-gray-800 dark:bg-gray-900 dark:text-white"
                {...fadeInUp}
            >
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 mt-12">
                    {/* Hero Section */}
                    <header className="bg-blue-600 text-white py-20 text-center">
                        <div className="max-w-4xl mx-auto px-4">
                            <h1 className="text-5xl font-bold">{service.title}</h1>
                            <p className="mt-4 text-lg">{service.desc}</p>
                        </div>
                    </header>

                    {/* What We Offer Section */}
                    <section className="w-full min-w-full bg-gray-100 dark:bg-gray-800">
                        <div className="max-w-5xl mx-auto px-4 py-12">
                            <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">What We Offer</h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {service.whatWeOffer.map((offer, index) => (
                                    <li
                                        key={index}
                                        className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-600"
                                    >
                                        <p className="text-gray-700 dark:text-gray-300">{offer}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section className="max-w-4xl mx-auto px-4 py-12 dark:bg-gray-900">
                        <h2 className="text-3xl font-bold mb-6 dark:text-white">How It Works</h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300">{service.howItWorks}</p>
                    </section>

                    {/* CTA Section */}
                    <CallToActionSection />
                </div>

            </motion.section>
            <footer className="bg-gray-900 text-white h-min flex flex-col items-center justify-center">
                <p className="text-sm  pb-10">
                    &copy; {new Date().getFullYear()} Adam Noetics. All rights reserved.
                </p>
            </footer>
        </>
    );
};

export default LandingPage;