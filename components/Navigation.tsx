"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Menu, X, MoreHorizontal, LayoutGrid } from "lucide-react"; // Import the Lucide icons

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <motion.header
      className="bg-white shadow py-4 fixed top-0 left-0 w-full z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Adam Noah</h1>

        {/* Hamburger Menu for Smaller Screens */}
        <button
          className="sm:hidden text-gray-800 hover:text-gray-600"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <LayoutGrid size={24} />}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex gap-6">
          <li>
            <a href="#about" className="hover:underline">
              About
            </a>
          </li>
          <li>
            <a href="#services" className="hover:underline">
              Services
            </a>
          </li>
          <li>
            <a href="#portfolio" className="hover:underline">
              Portfolio
            </a>
          </li>
          <li>
            <a href="login/" className="hover:underline">
              Login
            </a>
          </li>
        </ul>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <ul className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 sm:hidden">
            <li>
              <a
                href="#about"
                className="hover:underline text-gray-800"
                onClick={toggleMenu}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="hover:underline text-gray-800"
                onClick={toggleMenu}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#portfolio"
                className="hover:underline text-gray-800"
                onClick={toggleMenu}
              >
                Portfolio
              </a>
            </li>
            <li>
              <a
                href="login/"
                className="hover:underline text-gray-800"
                onClick={toggleMenu}
              >
                Login
              </a>
            </li>
          </ul>
        )}
      </nav>
    </motion.header>
  );
};

export default Navigation;
