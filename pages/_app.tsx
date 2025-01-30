import "@styles/globals.css";
import type { AppProps } from "next/app";
import { DarkModeProvider } from "../context/DarkModeContext";
import "../pages/dashboard/client.css"; // Moved here

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DarkModeProvider>
      <Component {...pageProps} />
    </DarkModeProvider>
  );
}