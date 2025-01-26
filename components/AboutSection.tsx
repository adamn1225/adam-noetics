import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../motionConfig";

const AboutSection = () => {
  return (
    <motion.section
      id="about"
      className="bg-white text-gray-800 dark:bg-gray-800 dark:text-white py-20"
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
          <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
            <h3 className="text-xl font-bold dark:text-white">Adam Noah</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Founder & Lead Developer</p>
          </div>
          {/* Team Member 2 */}
          <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
            <h3 className="text-xl font-bold dark:text-white">Julian Fox</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">CIO</p>
          </div>
          {/* Team Member 3 */}
          <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
            <h3 className="text-xl font-bold dark:text-white">Lukas A.</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Project Manager</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;