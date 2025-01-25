import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../motionConfig";

const CallToActionSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <motion.section
      id="contact"
      className="bg-blue-600 dark:bg-gray-700 text-white py-20"
      {...fadeInUp}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Let’s Build Something Amazing
        </h2>
        <p className="text-lg mb-6">
          Ready to take your business to the next level? Get in touch today, and
          let’s make it happen!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() =>
              (window.location.href = "mailto:anoah1225@gmail.com")
            }
            className="bg-white text-blue-600 hover:bg-gray-50 font-bold py-3 px-6 rounded-full"
          >
            Email Us
          </button>
          <button
            onClick={() => (window.location.href = "tel:+1234567890")}
            className="bg-white text-blue-600 hover:bg-gray-50 font-bold py-3 px-6 rounded-full"
          >
            Call Us
          </button>
          <button
            onClick={handleModalToggle}
            className="bg-white text-blue-600 hover:bg-gray-50 font-bold py-3 px-6 rounded-full"
          >
            Fill Out a Form
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white text-gray-900 rounded-lg shadow-lg w-11/12 max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Contact Us</h2>
              <button
                onClick={handleModalToggle}
                className="text-gray-500 hover:text-gray-800 font-bold text-lg"
              >
                ×
              </button>
            </div>
            <form className="space-y-4">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your Name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
  );
};

export default CallToActionSection;
