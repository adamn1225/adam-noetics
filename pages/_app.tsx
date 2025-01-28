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
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-S9Q4511QJC`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-S9Q4511QJC');
        `}
      </Script>
    </DarkModeProvider>
  );
}