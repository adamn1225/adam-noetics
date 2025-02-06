import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Menu, X, MoreHorizontal, LayoutGrid } from "lucide-react";
import DarkModeToggle from "@components/DarkModeToggle";
import Image from 'next/image';
import nextlogo from '@public/next_noetics.png';
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
    const [isDarkMode, setIsDarkMode] = useState(true);

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
            className={"bg-white dark:bg-gray-950 pt-2 fixed top-0 left-0 w-screen z-50 dark:border-0 dark:border-b-zinc-950 shadow-2xl"}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <nav className={"container mx-auto px-4 pb-2 flex text-gray-800 justify-between items-center " + quantico.className}>
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <a href="/">
                        <Image
                            src={nextlogo}
                            alt="Noetics.io Logo"
                            width={300}
                            height={150}
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
                        className="sm:hidden text-zinc-800 dark:text-white dark:hover:text-white hover:text-zinc-600"
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
                                className={"text-base hover:underline text-nowrap underline-offset-4 text-gray-950 dark:text-white hover- underline font-extrabold " + quantico.className}
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
