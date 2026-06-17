import Image from "next/image";

export const POST_IMAGE_SRC = "/sample.png";
export const POST_IMAGE_ASPECT_CLASS = "aspect-[4/5]";

const THUMB_SIZE_CLASSES = {
  default: "w-20",
  medium: "w-24",
  large: "w-28",
} as const;

const THUMB_IMAGE_SIZES = {
  default: "80px",
  medium: "96px",
  large: "112px",
} as const;

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

type PostThumbImageProps = {
  src?: string | null;
  alt?: string;
  className?: string;
  size?: keyof typeof THUMB_SIZE_CLASSES;
};

export function PostThumbImage({
  src,
  alt = "News",
  className = "",
  size = "default",
}: PostThumbImageProps) {
  const imageSrc = src || POST_IMAGE_SRC;

  return (
    <div
      className={`relative shrink-0 overflow-hidden ${POST_IMAGE_ASPECT_CLASS} ${THUMB_SIZE_CLASSES[size]} ${className}`}
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
          sizes={THUMB_IMAGE_SIZES[size]}
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
  aspectClassName = POST_IMAGE_ASPECT_CLASS,
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
