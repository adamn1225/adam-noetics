import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Menu, X, LayoutGrid } from "lucide-react";
import DarkModeToggle from "@components/DarkModeToggle";
import Image from 'next/image';
import deadLogo from '@public/dead_generics-logo.png';

interface NavigationProps {
  isFixed?: boolean;
  fontClass?: string;
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
      className={`bg-white dark:bg-zinc-500 z-50 pt-2 ${isFixed ? 'fixed top-0 left-0 w-full' : ''} dark:border-0 dark:border-b-zinc-950 shadow-2xl`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="container mx-auto px-4 pb-2 flex justify-between items-center">
        {/* Logo */}
        <span className="flex items-center gap-4">
          <a href="/">
            {isDarkMode ? (
              <Image
                src={deadLogo}
                alt="Noetics.io Logo"
                width={220}
                height={100}
                className="rounded-full"
              />
            ) : (
              <Image
                src={deadLogo}
                alt="Noetics.io Logo"
                width={220} // Adjust the width as needed
                height={100} // Adjust the height as needed
                className="rounded-full"
              />
            )}
          </a>
          <DarkModeToggle />
        </span>
        {/* Hamburger Menu for Smaller Screens */}
        <button
          className="sm:hidden text-zinc-800 dark:text-white hover:text-zinc-600"
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
          <ul className="absolute top-14 left-0 w-full bg-white dark:bg-zinc-900 shadow-md flex flex-col items-center gap-4 py-4 sm:hidden">
            <li>
              <a
                href="#about"
                className="hover:underline text-zinc-800 dark:text-white"
                onClick={toggleMenu}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="hover:underline text-zinc-800 dark:text-white"
                onClick={toggleMenu}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#portfolio"
                className="hover:underline text-zinc-800 dark:text-white"
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