"use client";
import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../motionConfig";

const ServicesSection = () => {
  return (
    <motion.section id="services" className="bg-gray-100 py-20" {...fadeInUp}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-10">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Custom Web Apps",
              desc: "Feature-rich platforms tailored to your needs.",
            },
            {
              title: "Automation",
              desc: "Streamline workflows and eliminate repetitive tasks.",
            },
            {
              title: "Custom Tools",
              desc: "Build calculators, directories, ticket support systems, and more.",
            },
            {
              title: "API Integrations",
              desc: "Seamlessly connect systems for efficient workflows.",
            },
            {
              title: "Web Scraping",
              desc: "Gather data automatically for actionable insights.",
            },
            {
              title: "Chrome Extensions",
              desc: "Create custom browser tools for productivity.",
            },
          ].map((service, idx) => (
            <div key={idx} className="bg-white p-6 shadow rounded-lg">
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-700">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;
