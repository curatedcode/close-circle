import { type NextPage } from "next";

import Layout from "~/components/Layout";
import Timeline from "~/components/Timeline";

import { useSession } from "next-auth/react";
import CreatePost from "~/components/CreatePost";

const Home: NextPage = () => {
  const { status } = useSession();

  return (
    <Layout
      title="Close Circle"
      description="Close Circle. Where friends can be close, no matter the distance."
    >
      {status === "authenticated" && <CreatePost />}
      <Timeline where={{}} />
    </Layout>
  );
};

export default Home;
