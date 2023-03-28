import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import Avatar from "~/components/Avatar";
import Link from "next/link";
import { env } from "~/env.mjs";
import { EyeSlashIcon } from "@heroicons/react/24/outline";

const SearchPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const searchText = typeof slug === "string" ? slug : ".";

  const { data, isLoading } = api.profile.search.useQuery({
    where: {
      name: searchText,
    },
  });

  if (isLoading) {
    return (
      <Layout
        title={`Search ${searchText} | Close Circle`}
        description={`Search results for ${searchText}`}
      >
        <span>Loading...</span>
      </Layout>
    );
  }

  function NotFound() {
    return (
      <Layout
        title={`Search ${searchText} | Close Circle`}
        description={`Search results for ${searchText}`}
      >
        <div className="mt-12 grid place-items-center gap-y-2 place-self-center">
          <EyeSlashIcon className="w-6" aria-hidden />
          <span className="">We couldn&apos;t find anything.</span>
        </div>
      </Layout>
    );
  }

  if (!data) return <NotFound />;

  if (data.users.length < 1) {
    return <NotFound />;
  }

  const searchResults = data.users.map((user) => (
    <Link
      href={`${env.NEXT_PUBLIC_BASE_URL}/profiles/${user.profileId}`}
      key={user.name}
      className="inline-flex w-full items-center gap-2 rounded-md bg-white px-4 py-2 dark:bg-web-gray"
    >
      <Avatar name={user.name} size="lg" src={user.image} />
      <span className="line-clamp-1">{user.name}</span>
    </Link>
  ));

  return (
    <Layout
      title={`Search ${searchText} | Close Circle`}
      description={`Search results for ${searchText}`}
    >
      <div className="mt-3 grid w-full max-w-sm gap-y-2 self-center px-1">
        {searchResults}
      </div>
    </Layout>
  );
};

export default SearchPage;
