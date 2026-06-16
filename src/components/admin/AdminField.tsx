type AdminFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function AdminField({
  label,
  hint,
  error,
  children,
  className = "",
}: AdminFieldProps) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      {children}
      {hint ? <span className="text-xs text-zinc-500">{hint}</span> : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

export const adminInputClassName =
  "h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-red-400";

export const adminTextareaClassName =
  "min-h-[110px] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-400";

export const adminSelectClassName =
  "h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-red-400";
