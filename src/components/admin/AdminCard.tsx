type AdminCardProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function AdminCard({
  title,
  description,
  children,
  className = "",
}: AdminCardProps) {
  return (
    <section
      className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}
    >
      {title ? (
        <div className="border-b border-zinc-100 px-5 py-4">
          <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm text-zinc-500">{description}</p>
          ) : null}
        </div>
      ) : null}
      <div className={title ? "p-5" : ""}>{children}</div>
    </section>
  );
}
