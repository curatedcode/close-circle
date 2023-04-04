import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import Avatar from "~/components/Avatar";
import Timeline from "~/components/Timeline";
import { useRouter } from "next/router";
import {
  PencilSquareIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { type NextPage } from "next";
import Custom404 from "../404";
import Loading from "~/components/Loading/Loading";
import Button from "~/components/Button/Button";
import { type ChangeEvent, useState, useEffect } from "react";

function FriendSection({
  areFriends,
  addFriend,
  removeFriend,
}: {
  areFriends: boolean | null;
  addFriend: () => void;
  removeFriend: () => void;
}) {
  return areFriends ? (
    <UserMinusIcon
      className="w-8 cursor-pointer rounded-full bg-web-gray-light p-1 text-white dark:bg-web-gray"
      aria-label="Remove friend"
      onClick={addFriend}
    />
  ) : (
    <UserPlusIcon
      className="w-8 cursor-pointer rounded-full bg-logo-blue p-1 text-white"
      aria-label="Add friend"
      onClick={removeFriend}
    />
  );
}

const ProfilePage: NextPage = () => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const { slug } = router.query;
  const client = useQueryClient();

  const profileId = typeof slug === "string" ? slug : "";

  const { data, isLoading, refetch } = api.profile.get.useQuery({
    where: {
      user: {
        profileId: profileId,
      },
    },
  });

  const { data: signedInUser } = api.profile.getProfileId.useQuery({
    where: { id: session?.user.id ?? "." },
  });
  const signedInUserId = signedInUser?.profileId || "";

  const addFriend = api.profile.addFriend.useMutation({
    onSuccess: () => client.invalidateQueries([["profile", "get"]]),
  });
  const removeFriend = api.profile.removeFriend.useMutation({
    onSuccess: () => client.invalidateQueries([["profile", "get"]]),
  });

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioBody, setBioBody] = useState("");
  const [bioErrorMessage, setBioErrorMessage] = useState("");
  const [isBioErrorVisible, setIsBioErrorVisible] = useState(false);

  const updateBio = api.profile.updateBio.useMutation({
    onSuccess: () => {
      setIsEditingBio(false), void refetch();
    },
  });

  useEffect(() => {
    if (!data) return;
    if (!data.profileData) return;
    setBioBody(data.profileData.bio ?? "");
  }, [data]);

  if (isLoading) return <Loading />;
  if (!data && !isLoading) return <Custom404 />;
  if (!data) return <Custom404 />;
  if (!data.profileData) return <Custom404 />;

  const { profileData, areFriends } = data;
  const { bio, name, image } = profileData;

  const isSameUser = profileId === signedInUserId;

  function onBioChange(e: ChangeEvent<HTMLTextAreaElement>) {
    if (e.currentTarget.value.length > 180) {
      setBioErrorMessage("Bio can't be longer than 180 characters");
      setIsBioErrorVisible(true);
      return;
    }
    setIsBioErrorVisible(false);
    setBioBody(e.currentTarget.value);
  }

  return (
    <Layout title={`${name} | Close Circle`} description={`${name}'s profile`}>
      <div className="flex w-full flex-col flex-nowrap items-center bg-white dark:bg-web-gray-light">
        <div className="flex w-full max-w-md flex-col items-center gap-1.5 self-center py-4 px-4 pb-6">
          {image && <Avatar src={image} name={name} size="xl" />}
          <div
            className={`w-full items-center justify-center gap-2 ${
              isEditingBio ? "flex flex-col" : "inline-flex"
            }`}
          >
            <span className="whitespace-nowrap text-lg font-medium">
              {name}
            </span>
            {status === "authenticated" && !isSameUser && (
              <FriendSection
                areFriends={areFriends}
                addFriend={() => {
                  void removeFriend.mutateAsync({
                    friendId: profileId,
                  });
                }}
                removeFriend={() => {
                  void addFriend.mutateAsync({
                    friendId: profileId,
                  });
                }}
              />
            )}
          </div>
          <div className="inline-flex items-center">
            {!isEditingBio && <p className="text-sm">{bio ?? "No bio..."}</p>}
            {status === "authenticated" && isSameUser && (
              <div>
                {!isEditingBio && (
                  <Button
                    aria-label="Edit bio"
                    icon={<PencilSquareIcon className="w-4" />}
                    onClick={() => setIsEditingBio((bool) => !bool)}
                    className=""
                  />
                )}
                {isEditingBio && (
                  <div className="-mt-1 flex flex-col gap-2">
                    <span
                      className={`-mb-1 self-center text-center font-medium text-red-500 ${
                        isBioErrorVisible ? "" : "invisible"
                      }`}
                    >
                      {bioErrorMessage}
                    </span>
                    <textarea
                      className="w-full resize-none overflow-y-auto rounded-md bg-web-white px-4 py-[0.45rem] text-black focus-within:ring-2  focus-within:ring-web-gray dark:bg-web-gray  dark:text-white focus-within:dark:ring-white"
                      placeholder="Add your bio..."
                      rows={5}
                      value={bioBody}
                      onChange={onBioChange}
                      name="post body"
                    />
                    <Button
                      className="self-end"
                      variant="filled"
                      onClick={() =>
                        void updateBio.mutateAsync({ bio: bioBody })
                      }
                    >
                      Save bio
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Timeline where={{ user: { profileId } }} />
    </Layout>
  );
};

export default ProfilePage;
