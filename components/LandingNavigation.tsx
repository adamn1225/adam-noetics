import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Menu, X, MoreHorizontal, LayoutGrid } from "lucide-react";
import DarkModeToggle from "@components/DarkModeToggle";
import Image from 'next/image';
import noeticsLogo from '@public/noeticslogo.png';
import noeticsLogoDark from '@public/darknoetics.png';

const LandingNavigation = () => {
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
            className="bg-white dark:bg-gray-500 py-4 fixed top-0 left-0 w-screen z-50 dark:border-0 dark:border-b-zinc-950 shadow-2xl"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <nav className="container mx-auto px-4 flex text-gray-800 justify-between items-center ">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <a href="/">
                        <Image
                            src={isDarkMode ? noeticsLogo : noeticsLogo}
                            alt="Noetics.io Logo"
                            width={250} // Adjust the width as needed
                            height={100} // Adjust the height as needed
                            className="rounded-full"
                        />
                    </a>
                </div>
                <span className="flex justify-end w-full mx-12 items-start gap-4">
                    <DarkModeToggle />
                </span>

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
                        <a
                            href="#cta"
                            className="text-base hover:underline text-nowrap underline-offset-4 text-gray-800 dark:text-white underline font-semibold"
                            onClick={toggleMenu}
                        >
                            Learn More
                        </a>
                    </li>
                    <li>
                        <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full">
                            Login
                        </a>
                    </li>
                </ul>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <ul className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 sm:hidden">

                        <li>
                            <a
                                href="login/"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full"
                                onClick={toggleMenu}
                            >
                                Login
                            </a>
                        </li>
                    </ul>
                )}
            </nav>
        </motion.header >
    );
};

export default LandingNavigation;
