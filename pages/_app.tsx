import React from "react";
import "@styles/globals.css";
import type { AppProps } from "next/app";
import { DarkModeProvider } from "@context/DarkModeContext";
import Navigation from "@components/Navigation";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <DarkModeProvider>
      <Component {...pageProps} />
    </DarkModeProvider>
  );
};

export default MyApp;