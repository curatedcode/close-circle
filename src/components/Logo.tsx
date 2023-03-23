/* eslint-disable @next/next/no-img-element */
interface LogoProps {
  height?: number;
  width?: number;
}

export default function Logo({ height = 40, width = 40 }: LogoProps) {
  return (
    <div className="flex w-fit items-center">
      <img
        src="/logo.svg"
        alt="Close Circle Logo"
        height={height}
        style={{
          minHeight: height,
          minWidth: height,
        }}
        width={width}
        className="rounded-full"
      />
    </div>
  );
}
