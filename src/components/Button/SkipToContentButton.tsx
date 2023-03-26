export default function SkipToContentButton() {
  return (
    <a
      href="#main"
      className="fixed left-1 z-50 -translate-y-full rounded-b-md bg-web-gray p-2 text-white opacity-0 transition-all focus-within:translate-y-0 focus-within:opacity-100 focus-within:ring-2 focus-within:ring-white dark:bg-white dark:text-black focus-within:dark:ring-web-gray"
    >
      Skip to content
    </a>
  );
}
