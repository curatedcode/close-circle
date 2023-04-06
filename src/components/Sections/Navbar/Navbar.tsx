import Link from "next/link";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Avatar from "~/components/Avatar";
import Button from "~/components/Button";
import Logo from "~/components/Logo";
import TextInput from "~/components/Inputs/TextInput";
import Tooltip from "~/components/Tooltip";
import Menu from "~/components/Menu";
import { useTheme } from "next-themes";
import { type KeyboardEvent, useRef, useState } from "react";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";

function UserMenu() {
  const { theme, setTheme } = useTheme();

  const { data: session, status } = useSession();

  const { data } = api.profile.getProfileId.useQuery({
    where: { id: session?.user.id ?? "" },
  });
  const profileId = data?.profileId || "";

  return (
    <Menu
      trigger={<Bars3Icon className="w-7 md:w-9" />}
      className={{
        trigger:
          "-mr-1 rounded-t-md px-4 py-[0.7rem] transition-colors hover:bg-web-white hover:dark:bg-web-gray md:py-[0.7rem]",
      }}
    >
      <div className="flex w-48 flex-col gap-2 rounded-md bg-white p-3 pb-4 shadow-lg dark:bg-web-gray-light">
        {status === "authenticated" && (
          <Link
            href={`${env.NEXT_PUBLIC_BASE_URL}/profiles/${profileId}`}
            className="inline-flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-web-white hover:dark:bg-web-gray"
          >
            <Avatar
              src={session.user.image ?? "profile-placeholder.jpg"}
              name="Your profile image"
              size="sm"
            />
            View Profile
          </Link>
        )}
        <div className="flex flex-col gap-1 border-t-1 border-zinc-300 pt-2 pb-2 dark:border-web-white">
          <label htmlFor="mode" className="self-center">
            Color mode
          </label>
          <select
            id="mode"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <Button
          onClick={() => void signOut()}
          variant="filled"
          className="self-center text-white"
        >
          Log out
        </Button>
      </div>
    </Menu>
  );
}

export default function Navbar() {
  const { status } = useSession();

  const [search, setSearch] = useState("");
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  function submitSearch(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && linkRef.current) {
      linkRef.current.click();
    }
  }

  return (
    <nav className="fixed top-0 z-10 inline-flex h-14 w-full justify-between bg-white px-4 dark:bg-web-gray-light">
      <div className="inline-flex items-center gap-4 justify-self-start">
        <Link href="/" aria-hidden="true" className="rounded-full">
          <Logo />
        </Link>
        {search && (
          <Link
            href={`${env.NEXT_PUBLIC_BASE_URL}/search/${search}`}
            ref={linkRef}
            hidden
          />
        )}
        <Tooltip label="Search" placement="bottom-start">
          <TextInput
            icon={
              <MagnifyingGlassIcon className="w-5 text-zinc-600 opacity-60 dark:text-zinc-300" />
            }
            radius="full"
            placeholder="Search..."
            className="hidden lg:flex"
            onKeyDown={(e) => void submitSearch(e)}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </Tooltip>
      </div>
      {status === "authenticated" ? (
        <UserMenu />
      ) : (
        <div className="inline-flex gap-8">
          <Button
            variant="outline"
            className="hidden self-center xs:block"
            onClick={() => void signIn()}
          >
            Log in
          </Button>
          <Button
            variant="filled"
            className="self-center"
            onClick={() => void signIn()}
          >
            Sign Up
          </Button>
        </div>
      )}
    </nav>
  );
}
