import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Menu, X, MoreHorizontal, LayoutGrid } from "lucide-react";
import DarkModeToggle from "@components/DarkModeToggle";
import Image from 'next/image';
import noeticsLogo from '@public/noeticslogo.png';
import deadLogo from '@public/dead_generics-logo.png';
import { Quantico } from "next/font/google";

const quantico = Quantico({
    subsets: ["latin"],
    weight: ["400", "700"],
    style: ["normal", "italic"],
    display: "swap",
});

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
            className={"bg-white dark:bg-zinc-500 py-4 fixed top-0 left-0 w-screen z-50 dark:border-0 dark:border-b-zinc-950 shadow-2xl"}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <nav className={"container mx-auto px-4 flex text-zinc-800 justify-between items-center " + quantico.className}>
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <a href="/">
                        <Image
                            src={isDarkMode ? deadLogo : deadLogo}
                            alt="Noetics.io Logo"
                            width={200} // Adjust the width as needed
                            height={80} // Adjust the height as needed
                            className="rounded-full"
                        />
                    </a>
                </div>
                <div className={"flex items-center"}>
                    <span className="flex justify-end w-full mx-8 items-start gap-4">
                        <DarkModeToggle />
                    </span>

                    {/* Hamburger Menu for Smaller Screens */}
                    <button
                        className="sm:hidden text-zinc-800 hover:text-zinc-600"
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <LayoutGrid size={24} />}
                    </button>

                    {/* Desktop Navigation */}
                    <ul className={"hidden sm:flex items-center gap-6"}>
                        <li>
                            <a
                                href="#cta"
                                className={"text-base hover:underline text-nowrap underline-offset-4 text-zinc-950 dark:text-white underline font-extrabold " + quantico.className}
                                onClick={toggleMenu}
                            >
                                Learn More
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
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <ul className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 sm:hidden">

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
                )}
            </nav>
        </motion.header >
    );
};

export default LandingNavigation;
