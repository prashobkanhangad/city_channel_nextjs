import Image from "next/image";
import type { Advertisement } from "@/types/advertisement";

type AdvertisementSlotProps = {
  ad: Advertisement | null | undefined;
  fallbackAspectClass?: string;
  label?: string;
  className?: string;
  compact?: boolean;
};

function isExternalUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function AdvertisementSlot({
  ad,
  fallbackAspectClass = "aspect-[16/10]",
  label = "Advertisement",
  className = "",
  compact = false,
}: AdvertisementSlotProps) {
  const aspectClass =
    ad?.aspectClass ?? (compact ? "aspect-[16/2]" : fallbackAspectClass);

  if (!ad) {
    return (
      <div className={className}>
        {!compact ? (
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-bold text-zinc-900">{label}</h4>
            <span className="text-xs text-zinc-500">Ad</span>
          </div>
        ) : null}
        <div className={`${aspectClass} rounded-lg bg-zinc-100`} />
      </div>
    );
  }

  const image = isExternalUrl(ad.imageUrl) ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ad.imageUrl}
      alt={ad.altText || ad.title}
      className="h-full w-full object-cover"
    />
  ) : (
    <Image
      src={ad.imageUrl}
      alt={ad.altText || ad.title}
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 33vw"
    />
  );

  const content = (
    <div className={`relative overflow-hidden rounded-lg bg-zinc-100 ${aspectClass}`}>
      {image}
    </div>
  );

  return (
    <div className={className}>
      {!compact ? (
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-bold text-zinc-900">{ad.title}</h4>
          <span className="text-xs text-zinc-500">Ad</span>
        </div>
      ) : null}
      {ad.linkUrl ? (
        <a
          href={ad.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-opacity hover:opacity-90"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
