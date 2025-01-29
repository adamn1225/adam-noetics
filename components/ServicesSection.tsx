import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../motionConfig";

const ServicesSection = () => {
  return (
    <motion.section id="services" className="bg-gray-900 dark:bg-gray-800 py-20" {...fadeInUp}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl text-white dark:text-white font-bold mb-10">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Custom Web Apps",
              desc: "Feature-rich platforms tailored to your needs.",
              list: ["Intuitive Interfaces", "Scalable Architecture", "Custom Features"],
              link: `/landing/noetic-web-apps`,
            },
            {
              title: "Custom Tools",
              desc: "Build calculators, directories, ticket support systems, and more.",
              list: ["Support Systems", "Data Visualization", "Custom Calculators"],
              link: `/landing/noetic-custom-tools`,
            },
            {
              title: "Noetic Automation & Web Scraping",
              desc: "Gather data automatically; streamline workflows and eliminate repetitive tasks.",
              list: ["Workflow Automation", "Automated Scraping", "Data Extraction"],
              link: `/landing/automation-and-web-scraping`,
            },

            {
              title: "Noetic Marketing",
              desc: "Strategies to help you reach your target audience.",
              list: ["SMM/PPC Advertising", "SEO", "Backlinking"],
              link: `/landing/noetic-marketing`,
            },
            {
              title: "API Integrations",
              desc: "Seamlessly connect systems for efficient workflows.",
              list: ["Third-Party/Develop APIs", "Real-Time Sync", "Secure Connections"],
              link: `/landing/noetic-api-integrations`,
            },
            {
              title: "Chrome Extensions",
              desc: "Create custom browser tools for productivity.",
              list: ["Store information", "Advanced bookmarking", "Automate tasks"],
              link: `/landing/noetic-chrome-extensions`,
            },
          ].map((service, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-700 p-6 shadow rounded-lg">
              <h3 className="text-xl font-bold mb-4 dark:text-white">{service.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{service.desc}</p>
              <ul className="mt-4 text-gray-700 dark:text-gray-300">
                {service.list.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <div className="mt-4 text-blue-600 underline dark:text-blue-400">
                <a href={service.link} className="hover:text-blue-800">
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