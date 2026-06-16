type AdminPageHeaderProps = {
  title: string;
  description: string;
  badge?: string;
};

export function AdminPageHeader({
  title,
  description,
  badge,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">{title}</h2>
        <p className="mt-1 text-sm text-zinc-600">{description}</p>
      </div>
      {badge ? (
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
          {badge}
        </span>
      ) : null}
    </div>
  );
}
