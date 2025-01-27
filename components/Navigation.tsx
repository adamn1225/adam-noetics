import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Menu, X, LayoutGrid } from "lucide-react";
import DarkModeToggle from "@components/DarkModeToggle";
import Image from 'next/image';
import noeticsLogo from '@public/noeticslogo.png';
import noeticsLogoDark from '@public/noeticslogo-dark.png';

interface NavigationProps {
  isFixed?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isFixed = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleChange);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <motion.header
      className={`bg-white dark:bg-gray-900 py-4 ${isFixed ? 'fixed top-0 left-0 w-full' : ''} dark:border-0 dark:border-b-zinc-950 shadow-2xl`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <span className="flex items-center gap-4">
          <a href="/">
            <Image
              src={noeticsLogo}
              alt="Noetics.io Logo"
              width={200} // Adjust the width as needed
              height={40} // Adjust the height as needed
              className={`rounded-full ${isDarkMode ? 'hidden' : 'block'}`}
            />
            <Image
              src={noeticsLogoDark}
              alt="Noetics.io Logo"
              width={200} // Adjust the width as needed
              height={40} // Adjust the height as needed
              className={`rounded-full ${isDarkMode ? 'block' : 'hidden'}`}
            />
          </a>
          <DarkModeToggle />
        </span>
        {/* Hamburger Menu for Smaller Screens */}
        <button
          className="sm:hidden text-gray-800 dark:text-white hover:text-gray-600"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <LayoutGrid size={24} />}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex items-center gap-6">
          <li>
            <a href="#about" className="hover:underline dark:text-white">
              About
            </a>
          </li>
          <li>
            <a href="#services" className="hover:underline dark:text-white">
              Services
            </a>
          </li>
          <li>
            <a href="#portfolio" className="hover:underline dark:text-white">
              Portfolio
            </a>
          </li>
          <li>
            <a
              href="/login"
              className="onboardbutton py-3 px-6 rounded-full"
              onClick={toggleMenu}
            >
              Login
              <div className="arrow-wrapper">
                <div className="arrow"></div>
              </div>
            </a>
          </li>
        </ul>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <ul className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md flex flex-col items-center gap-4 py-4 sm:hidden">
            <li>
              <a
                href="#about"
                className="hover:underline text-gray-800 dark:text-white"
                onClick={toggleMenu}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="hover:underline text-gray-800 dark:text-white"
                onClick={toggleMenu}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#portfolio"
                className="hover:underline text-gray-800 dark:text-white"
                onClick={toggleMenu}
              >
                Portfolio
              </a>
            </li>
            <li>
              <a
                href="login/"
                className="onboardbutton py-2 px-4 rounded-full"
                onClick={toggleMenu}
              >
                Login
                <div className="arrow-wrapper">
                  <div className="arrow"></div>
                </div>
              </a>
            </li>
          </ul>
        )}
      </nav>
    </motion.header>
  );
};

export default Navigation;