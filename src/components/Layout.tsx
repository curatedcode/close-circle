import Head from "next/head";
import type { LayoutProps } from "~/utils/customTypes";
import SkipToContentButton from "./Button/SkipToContentButton";
import Navbar from "./Sections/Navbar";

export default function Layout({ title, description, children }: LayoutProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className="h-screen">
        <SkipToContentButton />
        <Navbar />
        <main
          id="main"
          className="flex min-h-full flex-col bg-web-white pt-[56px] text-gray-900 dark:bg-web-gray dark:text-gray-200"
        >
          {children}
        </main>
      </div>
    </>
  );
}
