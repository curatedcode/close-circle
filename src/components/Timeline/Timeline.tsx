import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import Post from "~/components/Posts";
import { api, type RouterInputs } from "~/utils/api";
import useScrollPosition from "../Fn/useScrollPosition";
import Custom404 from "~/pages/404";
import Loading from "../Loading/Loading";

export default function Timeline({
  where = {},
}: {
  where: RouterInputs["post"]["infinite"]["where"];
}) {
  const LIMIT = 4;

  const scrollPosition = useScrollPosition();
  const prevScrollPosition = useRef(0);

  const { data, hasNextPage, fetchNextPage, isFetching, isLoading } =
    api.post.infinite.useInfiniteQuery(
      { limit: LIMIT, where },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const client = useQueryClient();

  useEffect(() => {
    // help stop query looping
    if (
      scrollPosition > 70 &&
      hasNextPage &&
      !isFetching &&
      scrollPosition !== prevScrollPosition.current
    ) {
      prevScrollPosition.current = scrollPosition;
      void fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);

  if (!data && !isLoading) return <Custom404 />;

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div className="flex w-full flex-col items-center gap-6 place-self-center p-4 pt-6">
      {isLoading && posts.length < 1 && <Loading />}
      {posts.length > 0 &&
        posts.map((post) => (
          <Post
            key={post.id}
            postRouter={post}
            client={client}
            input={{ where, limit: LIMIT }}
          />
        ))}
      {!isLoading && posts.length < 0 && (
        <span className="mt-8 text-center text-lg text-gray-400">
          This is the end...
        </span>
      )}
    </div>
  );
}
