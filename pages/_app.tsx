import React from "react";
import "@styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { DarkModeProvider } from "@context/DarkModeContext";
import { Editor } from "@craftjs/core";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();

  // Define routes that should be wrapped with the Editor provider
  const editorRoutes = ["/dashboard/content"];

  const isEditorRoute = editorRoutes.includes(router.pathname);

  return (
    <DarkModeProvider>
      {isEditorRoute ? (
        <Editor>
          <Component {...pageProps} />
        </Editor>
      ) : (
        <Component {...pageProps} />
      )}
    </DarkModeProvider>
  );
};

export default MyApp;