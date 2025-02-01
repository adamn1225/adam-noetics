import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../motionConfig";

const ServicesSection = () => {
  return (
    <motion.section id="services" className="bg-zinc-900 dark:bg-zinc-800 py-20" {...fadeInUp}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl text-white dark:text-white font-bold mb-10">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Bespoke Web Apps",
              desc: "Forget off-the-shelf. We build high-performance, scalable web applications designed around your unique needs.",
              list: ["Sleek, Intuitive UX", "Enterprise-Grade Scalability", "Feature-Rich Customization"],
              link: `/landing/noetic-web-apps`,
            },
            {
              title: "Custom Digital Tools",
              desc: "Need a specialized tool? From dynamic calculators to support ticket systems, we build solutions that streamline your workflow.",
              list: ["Interactive Calculators", "Data Visualization Dashboards", "Automated Support Systems"],
              link: `/landing/noetic-custom-tools`,
            },
            {
              title: "Automation & Web Scraping",
              desc: "Eliminate repetitive tasks, gather critical data, and optimize your operations with our automation expertise.",
              list: ["Workflow Automation", "AI-Powered Data Scraping", "Intelligent Data Processing"],
              link: `/landing/automation-and-web-scraping`,
            },
            {
              title: "Noetic Marketing",
              desc: "Your audience won’t find you by accident. We create data-driven marketing strategies that amplify your brand’s reach.",
              list: ["Paid Ads (PPC, SMM)", "SEO & High-Authority Backlinks", "Conversion-Optimized Content"],
              link: `/landing/noetic-marketing`,
            },
            {
              title: "Seamless API Integrations",
              desc: "Connect, sync, and enhance your digital ecosystem with frictionless API integrations tailored for efficiency.",
              list: ["Third-Party API Connections", "Real-Time Data Sync", "Secure & Scalable Solutions"],
              link: `/landing/noetic-api-integrations`,
            },
            {
              title: "Custom Chrome Extensions",
              desc: "Boost productivity, streamline tasks, and create browser-based tools that work the way you need them to.",
              list: ["Data Storage & Automation", "Advanced Bookmarking", "Custom Browsing Enhancements"],
              link: `/landing/noetic-chrome-extensions`,
            },
          ].map((service, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-700 p-6 shadow rounded-lg">
              <h3 className="text-xl font-bold mb-4 dark:text-white">{service.title}</h3>
              <p className="text-zinc-700 dark:text-zinc-300">{service.desc}</p>
              <ul className="mt-4 text-zinc-700 dark:text-zinc-300">
                {service.list.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <div className="mt-4 text-red-500 underline dark:text-red-400">
                <a href={service.link} className="hover:text-red-600">
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;