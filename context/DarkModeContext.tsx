import React, { createContext, useContext, useEffect, useState } from "react";

interface DarkModeContextProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps | undefined>(undefined);

interface DarkModeProviderProps {
    children: React.ReactNode;
    initialDarkMode?: boolean;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children, initialDarkMode = false }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            const savedMode = localStorage.getItem("darkMode");
            return savedMode ? savedMode === "true" : initialDarkMode;
        }
        return initialDarkMode;
    });

    useEffect(() => {
        localStorage.setItem("darkMode", isDarkMode.toString());
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    // Apply the initial dark mode class on mount
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error("useDarkMode must be used within a DarkModeProvider");
    }
    return context;
};

export const DarkModeEnabled = () => {
    const { isDarkMode } = useDarkMode();
    return isDarkMode;
};