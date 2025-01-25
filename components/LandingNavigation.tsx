import { motion } from "framer-motion";
import React, { useState } from "react";
import { Menu, X, MoreHorizontal, LayoutGrid } from "lucide-react";
import DarkModeToggle from "@components/DarkModeToggle";

const LandingNavigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <motion.header
            className="bg-white py-4 fixed top-0 left-0 w-full z-50 dark:border-2 dark:border-b-zinc-950 shadow-2xl dark:bg-gray-900"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <nav className="container mx-auto px-4 flex justify-between items-center ">
                {/* Logo */}
                <span className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold tracking-widest dark:text-white ">Adam Noetic&apos;s</h1>
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
                            className="hover:underline text-gray-800"
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

export default LandingNavigation;
