import { motion } from "framer-motion";
import { fadeInUp } from "../motionConfig";
import Image from "next/image";

const PortfolioSection = () => {
  return (
    <motion.section id="portfolio" className="bg-white dark:bg-gray-800 py-20" {...fadeInUp}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-10 dark:text-white">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Property Management App",
              desc: "A custom platform to manage listings and bookings.",
              imgSrc: "/lp-modal.png",
            },
            {
              title: "Shipper’s Portal",
              desc: "Integrated with a TMS for logistics management.",
              imgSrc: "/shipper-connect.png",
            },
            {
              title: "Chrome Extensions",
              desc: "Custom extensions for enhanced productivity",
              imgSrc: "/chrome-ext.png",
            },
          ].map((project, idx) => (
            <div key={idx} className="bg-gray-100 dark:bg-gray-700 p-6 shadow rounded-lg">
              <Image src={project.imgSrc} alt={project.title} width={500} height={300} className="mb-4 rounded-lg" />
              <h3 className="text-xl font-bold mb-4 dark:text-white">{project.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{project.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default PortfolioSection;