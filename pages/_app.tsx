import "@styles/globals.css";
import type { AppProps } from "next/app";
import { DarkModeProvider } from "../context/DarkModeContext";
import Head from "next/head";
import Script from "next/script";

type NextPageWithLayout = AppProps['Component'] & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

export default function App({ Component, pageProps }: { Component: NextPageWithLayout, pageProps: any }) {
  const getLayout = Component.getLayout || ((page: React.ReactNode) => page);

  return (
    <DarkModeProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Noetic Software and Web Key Solutions" />
        <link rel="canonical" href="https://noetics.io" />
        <title>Noetics Web Creations</title>
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
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </DarkModeProvider>
  );
}