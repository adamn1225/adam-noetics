import { useRouter } from "next/router";
import React, { useState } from "react";
import RootLayout from "../layout";
import LandingNavigation from "@components/LandingNavigation";
import { motion } from "framer-motion";
import { fadeInUp } from "../../motionConfig";

const services = [
    {
        slug: "noetic-web-apps",
        title: "Custom Web Apps",
        howItWorks: "We streamline workflows and eliminate repetitive tasks. Our custom automations are designed to save you time and reduce complexity. Whether you need task scheduling, workflow automation, or custom triggers, we can help you automate your processes.",
        desc: "Feature-rich platforms tailored to your needs.",
        list: ["Intuitive interfaces", "Scalable architecture", "Custom features"],
        listDesc: ["Feature 1 description", "Feature 2 description", "Feature 3 description"],
    },
    {
        slug: "noetic-automation",
        title: "Automation",
        howItWorks: "We streamline workflows and eliminate repetitive tasks. Our custom automations are designed to save you time and reduce complexity. Whether you need task scheduling, workflow automation, or custom triggers, we can help you automate your processes.",
        desc: "Streamline workflows and eliminate repetitive tasks.",
        list: ["Workflow automation", "Task scheduling", "Custom triggers"],
        listDesc: ["Feature 1 description", "Feature 2 description", "Feature 3 description"],
    },
    {
        slug: "noetic-custom-tools",
        title: "Custom Tools",
        howItWorks: "Our custom tools are designed to streamline processes and enhance productivity. Whether you need data visualization, support systems, or custom calculators, we can help you build the tools you need.",
        desc: "Build calculators, directories, ticket support systems, and more. Live chats, chat bots, directories, ticket support systems, and more. ",
        list: ["Custom calculators", "Data visualization", "Support systems"],
        listDesc: ["Feature 1 description", "Feature 2 description", "Feature 3 description"],
    },
    {
        slug: "noetic-api-integrations",
        title: "API Integrations",
        howItWorks: "We streamline workflows and eliminate repetitive tasks. Our custom automations are designed to save you time and reduce complexity. Whether you need task scheduling, workflow automation, or custom triggers, we can help you automate your processes.",
        desc: "Seamlessly connect systems for efficient workflows.",
        list: ["Third-party APIs", "Secure connections", "Real-time sync"],
        listDesc: ["Feature 1 description", "Feature 2 description", "Feature 3 description"],
    },
    {
        slug: "noetic-web-scraping",
        title: "Web Scraping",
        howItWorks: "We streamline workflows and eliminate repetitive tasks. Our custom automations are designed to save you time and reduce complexity. Whether you need task scheduling, workflow automation, or custom triggers, we can help you automate your processes.",
        desc: "Gather data automatically for actionable insights.",
        list: ["Automated scraping", "Data extraction", "Real-time monitoring"],
        listDesc: ["Feature 1 description", "Feature 2 description", "Feature 3 description"],
    },
    {
        slug: "noetic-chrome-extensions",
        title: "Chrome Extensions",
        howItWorks: "We streamline workflows and eliminate repetitive tasks. Our custom automations are designed to save you time and reduce complexity. Whether you need task scheduling, workflow automation, or custom triggers, we can help you automate your processes.",
        desc: "Create custom browser tools for productivity.",
        list: ["Store information", "Advanced bookmarking", "Automate tasks"],
        listDesc: ["Feature 1 description", "Feature 2 description", "Feature 3 description"],
    },
];

const LandingPage = () => {
    const router = useRouter();
    const { slug } = router.query;
    const service = services.find((s) => s.slug === slug);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!service) {
        return <p className="text-center mt-20">Service not found</p>;
    }

    function handleModalToggle() {
        setIsModalOpen((prev) => !prev);
    }

    return (
        <>
            <LandingNavigation />
            <motion.section
                className="bg-white text-gray-800 dark:bg-gray-900 dark:text-white"
                {...fadeInUp}
            >
                <div className="bg-gray-50 dark:bg-gray-800 pt-16">
                    {/* Hero Section */}
                    <header className="bg-gray-900 text-white py-24 mt-4 text-center">
                        <div className="max-w-4xl mx-auto px-4">
                            <h1 className="text-5xl font-bold">{service.title}</h1>
                            <p className="mt-4 text-xl">{service.desc}</p>
                        </div>
                    </header>

                    {/* Features Section */}
                    <main className="max-w-5xl mx-auto px-4 py-12">
                        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {service.list.map((feature, index) => (
                                <li
                                    key={index}
                                    className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-600"
                                >
                                    <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center">{feature}</h3>
                                    <p className="text-xl mt-2 text-gray-700 dark:text-gray-300 text-center">{service.listDesc[index]}</p>
                                </li>
                            ))}
                        </ul>
                    </main>

                    {/* How It Works Section */}
                    <section className="bg-gray-100 dark:bg-gray-700 py-24">
                        <div className="max-w-5xl mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
                            <p className="text-xl text-center font-medium text-gray-800 dark:text-gray-300">{service.howItWorks}</p>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section id="cta" className="bg-blue-600 text-white py-16 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
                            <p className="mt-4 text-xl">
                                Let&apos;s build something amazing together. Reach out to us today to discuss your project.
                            </p>
                            <button
                                onClick={handleModalToggle}
                                className="mt-6 bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition">
                                Contact Us
                            </button>
                        </div>
                    </section>
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Contact Us</h2>
                                <button
                                    onClick={handleModalToggle}
                                    className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 font-bold text-lg"
                                >
                                    ×
                                </button>
                            </div>
                            <form className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-base font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Your Name"
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-base font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm text-nowrap font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Feel free to provide more details on what you&apos;re trying to achieve
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Tell us about your project..."
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </motion.section>
            <footer className="bg-gray-900 text-white py-6">
                <div className="container mx-auto text-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Adam Noetics. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
};

export default LandingPage;