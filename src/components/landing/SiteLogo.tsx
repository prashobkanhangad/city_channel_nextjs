import Image from "next/image";
import Link from "next/link";

type SiteLogoProps = {
  href?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

export function SiteLogo({
  href = "/",
  className = "",
  width = 160,
  height = 48,
  priority = false,
}: SiteLogoProps) {
  const image = (
    <Image
      src="/logo.png"
      alt="City Channel"
      width={width}
      height={height}
      priority={priority}
      className={`h-auto w-auto object-contain ${className}`}
    />
  );

  if (!href) {
    return image;
  }

  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      {image}
    </Link>
  );
}
