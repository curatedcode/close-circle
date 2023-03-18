import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Logo from "~/components/Logo";

const Custom500: NextPage = () => {
  const router = useRouter();
  const redirect = setTimeout(() => void router.replace("/"), 3000);

  useEffect(() => {
    return () => clearTimeout(redirect);
  });

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Internal error | Close Circle</title>
        <meta name="description" content="internal server error" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className="flex h-screen items-center justify-center bg-web-gray text-lg text-web-white sm:text-xl">
        <div className="-mt-32 grid h-fit place-content-center place-items-center [&>p]:text-center">
          <Logo width={100} height={100} />
          <p className="mt-8 text-xl sm:text-2xl">
            Sorry it seems we&apos;re having an issue doing that
          </p>
          <p className="text-xl sm:text-2xl">
            You&apos;ll be redirected to the homepage shortly.
          </p>
          <div className="mt-4 inline-flex gap-1">
            <p>Otherwise</p>
            <Link href="/" className="text-blue-300 underline">
              click here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom500;
