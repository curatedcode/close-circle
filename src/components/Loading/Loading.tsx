export default function Loading({ className }: { className: string }) {
  return (
    <div
      className={`mt-8 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-logo-blue motion-reduce:animate-[spin_1.5s_linear_infinite] ${
        className || ""
      }`}
      role="status"
    ></div>
  );
}
