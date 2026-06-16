import Image from "next/image";

export const POST_IMAGE_SRC = "/sample.png";

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

type PostThumbImageProps = {
  src?: string | null;
  alt?: string;
  className?: string;
};

export function PostThumbImage({
  src,
  alt = "News",
  className = "h-16 w-20",
}: PostThumbImageProps) {
  const imageSrc = src || POST_IMAGE_SRC;

  return (
    <div className={`relative shrink-0 overflow-hidden ${className}`}>
      {isRemoteImage(imageSrc) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="160px"
          className="object-cover"
        />
      )}
    </div>
  );
}

type PostFeaturedImageProps = {
  src?: string | null;
  alt?: string;
  className?: string;
  aspectClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function PostFeaturedImage({
  src,
  alt = "News",
  className = "",
  aspectClassName = "aspect-[16/6]",
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 66vw",
}: PostFeaturedImageProps) {
  const imageSrc = src || POST_IMAGE_SRC;

  return (
    <div
      className={`relative w-full overflow-hidden ${aspectClassName} ${className}`}
    >
      {isRemoteImage(imageSrc) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      )}
    </div>
  );
}
