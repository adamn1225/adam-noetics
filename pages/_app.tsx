import "@styles/globals.css";
import type { AppProps } from "next/app";
import { DarkModeProvider } from "../context/DarkModeContext";
import Script from 'next/script';

type NextPageWithLayout = AppProps['Component'] & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

export default function App({ Component, pageProps }: { Component: NextPageWithLayout, pageProps: any }) {
  const getLayout = Component.getLayout || ((page: React.ReactNode) => page);

  return (
    <DarkModeProvider>
      {getLayout(<Component {...pageProps} />)}
    </DarkModeProvider>
  );
}