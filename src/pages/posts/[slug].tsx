import { useQueryClient } from "@tanstack/react-query";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Post from "~/components/Posts/Post";
import Layout from "~/components/Layout";
import Custom404 from "../404";
import Loading from "~/components/Loading/Loading";

const ProfilePostPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const client = useQueryClient();

  const postId = typeof slug === "string" ? slug : "";

  const { data, isLoading } = api.post.getOne.useQuery({
    where: { id: postId },
  });

  if (isLoading) return <Loading />;
  if (!data && !isLoading) return <Custom404 />;
  if (!data.post) return <Custom404 />;
  const { post } = data;

  return (
    <Layout
      title={`${post.user.name}'s post | Close Circle`}
      description="user post"
    >
      <div className="flex w-full flex-col items-center gap-6 place-self-center p-4 pt-6">
        <Post client={client} input={{}} postRouter={post} />
      </div>
    </Layout>
  );
};

export default ProfilePostPage;
