import React from "react";
import { useDarkMode } from "@context/DarkModeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const DarkModeToggle: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    return (
        <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full focus:outline-none"
            aria-label="Toggle Dark Mode"
        >
            {isDarkMode ? (
                <FaSun className="text-yellow-500 w-6 h-6" />
            ) : (
                <FaMoon className="text-gray-800 dark:text-gray-300 w-6 h-6" />
            )}
        </button>
    );
};

export default DarkModeToggle;