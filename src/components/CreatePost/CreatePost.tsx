/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import Tooltip from "~/components/Tooltip";
import Button from "~/components/Button";
import {
  PaperAirplaneIcon,
  PencilSquareIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";

export default function CreatePost({
  showFloatingButton = true,
}: {
  showFloatingButton?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [body, setBody] = useState("");
  const [files, setFiles] = useState<FileList>();
  const [images, setImages] = useState<string[]>();

  const [isBodyErrorVisible, setIsBodyErrorVisible] = useState(false);

  const [bodyErrorMessage, setBodyErrorMessage] = useState("");

  function onBodyChange(e: ChangeEvent<HTMLTextAreaElement>) {
    if (e.currentTarget.value.length > 280) {
      setBodyErrorMessage("Body can't be longer than 280 characters");
      setIsBodyErrorVisible(true);
      return;
    }
    setIsBodyErrorVisible(false);
    setBody(e.currentTarget.value);
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.currentTarget.files) return;
    if (e.currentTarget.files.length > 5) {
      setBodyErrorMessage("You can't upload more than 5 images");
      setIsBodyErrorVisible(true);
      return;
    }
    setFiles(e.currentTarget.files);
  }

  const client = useQueryClient();

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      void client.invalidateQueries({
        queryKey: [["post", "infinite"]],
      });
    },
  });
  const presignedUrls = api.post.getPresignedUrls.useMutation();

  async function submitPost() {
    if (!body && !files) {
      setBodyErrorMessage("Post can't be empty");
      setIsBodyErrorVisible(true);
      return;
    }

    const imageUrls: string[] = [];
    if (files) {
      // check if a file is over 4MB
      const isAnyFileOverLimit = [...files].some(
        (file) => file.size / 1048576 > 4
      );

      if (isAnyFileOverLimit) {
        setBodyErrorMessage("Image file size is too large");
        setIsBodyErrorVisible(true);
        return;
      }

      const urls = await presignedUrls.mutateAsync({ toCreate: files.length });

      for (let i = 0; i < files.length; i++) {
        const url = urls[i];
        const file = files[i];
        if (!url || !file) return;

        await fetch(url, {
          method: "PUT",
          body: file,
        });

        // gets the image url excluding the temporary params
        const permanentURL = url.split("?")[0];
        if (typeof permanentURL !== "string") return;

        imageUrls.push(permanentURL);

        if (inputRef.current) {
          inputRef.current.value = "";
          setImages([]);
        }
      }
      setBody("");
    }

    await createPost.mutateAsync({
      body,
      imageUrls,
    });
  }

  useEffect(() => {
    if (!isBodyErrorVisible) return;
    setTimeout(() => setIsBodyErrorVisible(false), 5000);
  }, [isBodyErrorVisible]);

  useEffect(() => {
    if (!files) return;
    const imgArr = [...files].map((file) => URL.createObjectURL(file));
    setImages(imgArr);
  }, [files]);

  return (
    <>
      <div className="flex w-full flex-col items-center place-self-center p-4">
        <div className="flex w-full max-w-[42rem] flex-col rounded-md bg-white px-6 py-4 shadow-md transition-transform dark:bg-web-gray-light">
          <span
            className={`font-medium text-red-500 ${
              isBodyErrorVisible ? "" : "hidden"
            }`}
          >
            * {bodyErrorMessage}
          </span>
          <textarea
            className="w-full resize-none overflow-y-auto rounded-md bg-web-white px-4 py-[0.45rem] text-black focus-within:ring-2  focus-within:ring-web-gray dark:bg-web-gray  dark:text-white focus-within:dark:ring-white"
            placeholder="Create a post..."
            rows={5}
            value={body}
            onChange={onBodyChange}
            aria-label="post body"
          />
          <div className="mt-2 inline-flex w-full items-end justify-end gap-2">
            <Tooltip label="Attach images">
              <Button
                icon={<PhotoIcon className="-mt-5 w-5 xs:-mt-6" />}
                aria-label="upload images"
                name="upload images"
                className="hover:opacity-80"
                onClick={() => inputRef.current?.click()}
              />
              <label htmlFor="file_upload" className="hidden">
                Upload file
              </label>
              <input
                id="file_upload"
                type="file"
                name="file upload"
                multiple
                accept="image/*"
                className="hidden"
                ref={inputRef}
                onChange={onFileChange}
              />
            </Tooltip>
            <Button
              icon={<PaperAirplaneIcon className="w-5" />}
              variant="filled"
              className="self-end font-medium"
              onClick={() => void submitPost()}
              aria-label="publish post"
            >
              <span className="hidden xs:inline">Post</span>
            </Button>
          </div>
          <div className="mt-2 grid gap-2 xs:flex">
            {images &&
              images.map((url) => (
                <img src={url} alt="" className="h-20 w-20" key={url} />
              ))}
          </div>
        </div>
      </div>
      {showFloatingButton && (
        <div className="fixed bottom-4 right-4 z-10 hidden xs:block">
          <Tooltip label="Create post" placement="left">
            <PencilSquareIcon
              aria-hidden
              onClick={() => void document.documentElement.scrollTo({ top: 0 })}
              className="w-12 cursor-pointer rounded-lg bg-white p-2 text-logo-blue shadow-md shadow-zinc-400 dark:bg-web-gray-light dark:text-web-white dark:shadow-zinc-700"
            />
          </Tooltip>
        </div>
      )}
    </>
  );
}
