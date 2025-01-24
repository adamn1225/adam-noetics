"use client";
import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../motionConfig";

const AboutSection = () => {
  return (
    <motion.section
      id="about"
      className="bg-white text-gray-800 py-20"
      {...fadeInUp}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">About Us</h2>
        <p className="text-lg leading-relaxed mb-8">
          We’re a dedicated team of web developers, designers, and
          problem-solvers committed to helping businesses thrive in the digital
          world. From building feature-rich web applications to creating smart
          automations, we specialize in transforming ideas into impactful
          solutions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Team Member 1 */}
          <div className="p-6 bg-gray-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Adam Noah</h3>
            <p className="text-sm text-gray-600">Founder & Lead Developer</p>
            <p className="mt-2 text-gray-700">
              Specializing in web apps, API integrations, and smart automations,
              Adam leads the team with a hands-on approach and technical
              expertise.
            </p>
          </div>
          {/* Team Member 2 */}
          <div className="p-6 bg-gray-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Julian</h3>
            <p className="text-sm text-gray-600">UI/UX Designer</p>
            <p className="mt-2 text-gray-700">
              Jane ensures every project is intuitive and visually stunning,
              bringing ideas to life with modern design practices.
            </p>
          </div>
          {/* Team Member 3 */}
          <div className="p-6 bg-gray-100 rounded-lg shadow">
            <h3 className="text-xl font-bold">Sebastian O.</h3>
            <p className="text-sm text-gray-600">Automation Specialist</p>
            <p className="mt-2 text-gray-700">
              With a focus on streamlining workflows, John develops innovative
              automations that save time and reduce complexity.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
