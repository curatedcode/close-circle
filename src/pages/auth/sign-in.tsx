/* eslint-disable @next/next/no-img-element */
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth";
import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import Logo from "~/components/Logo";
import Tooltip from "~/components/Tooltip/Tooltip";
import { authOptions } from "~/server/auth";

const SignInPage = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Sign in | Close Circle</title>
        <meta name="description" content="Sign in page for Close Circle" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className="grid h-screen w-screen place-items-center bg-web-white px-2 dark:bg-web-gray">
        <div className="flex w-full max-w-sm flex-col place-items-center gap-2 rounded-xl bg-white px-6 py-6 dark:bg-web-gray-light dark:text-white">
          <Logo height={60} width={60} />
          <span className="mb-6 text-2xl font-semibold sm:text-3xl">
            Sign in to your account
          </span>
          <form className="grid w-full gap-y-4">
            <div className="grid gap-y-1">
              <label htmlFor="email" className="indent-1 font-medium">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="text"
                className="rounded-md bg-web-white px-2 py-1 dark:bg-web-gray"
              />
            </div>
            <div className="grid gap-y-1">
              <label htmlFor="password" className="indent-1 font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="rounded-md bg-web-white px-2 py-1 dark:bg-web-gray"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-logo-blue py-1 font-medium text-white"
            >
              Sign in
            </button>
          </form>
          <div className="my-4 flex w-full items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p className="mx-4 mb-0 text-center font-medium text-neutral-500 dark:text-neutral-300">
              Or continue with
            </p>
          </div>
          <div className="flex w-40 justify-center gap-6">
            {providers &&
              Object.values(providers).map((provider) => (
                <Tooltip
                  label={`Sign in with ${provider.name}`}
                  key={provider.name}
                >
                  <button
                    key={provider.name}
                    onClick={() => void signIn(provider.id)}
                    type="button"
                    className={`h-14 w-14 rounded-md bg-neutral-200 px-3 py-1 shadow-zinc-400 transition-all hover:text-white hover:shadow-md dark:shadow-zinc-700 ${
                      provider.name === "Google"
                        ? "hover:bg-red-400"
                        : "hover:bg-blue-500"
                    }`}
                    aria-label={`sign in with ${provider.name}`}
                  >
                    {provider.name === "Google" && (
                      <img
                        src="/google-logo.png"
                        className="relative left-1/2 w-full -translate-x-1/2"
                        alt="Google logo"
                      />
                    )}
                    {provider.name === "Facebook" && (
                      <img
                        src="/facebook-logo.png"
                        className="relative left-1/2 w-full -translate-x-1/2"
                        alt="Facebook Logo"
                      />
                    )}
                  </button>
                </Tooltip>
              ))}
          </div>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}

export default SignInPage;
