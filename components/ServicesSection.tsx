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
              list: ["Feature 1", "Feature 2", "Feature 3"],
              link: `/landing/noetic-web-apps`,
            },
            {
              title: "Automation",
              desc: "Streamline workflows and eliminate repetitive tasks.",
              list: ["Feature 1", "Feature 2", "Feature 3"],
              link: `/landing/noetic-automation`,
            },
            {
              title: "Custom Tools",
              desc: "Build calculators, directories, ticket support systems, and more.",
              list: ["Feature 1", "Feature 2", "Feature 3"],
              link: `/landing/noetic-custom-tools`,
            },
            {
              title: "API Integrations",
              desc: "Seamlessly connect systems for efficient workflows.",
              list: ["Feature 1", "Feature 2", "Feature 3"],
              link: `/landing/noetic-api-integrations`,
            },
            {
              title: "Web Scraping",
              desc: "Gather data automatically for actionable insights.",
              list: ["Feature 1", "Feature 2", "Feature 3"],
              link: `/landing/noetic-web-scraping`,
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
              <div className="mt-4 text-blue-600 dark:text-blue-400">
                <a href={service.link} className="hover:underline">
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