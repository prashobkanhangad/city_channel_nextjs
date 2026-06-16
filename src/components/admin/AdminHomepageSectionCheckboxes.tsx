import { HOMEPAGE_SECTIONS } from "@/lib/constants/homepageSections";
import type { HomepageSection } from "@/lib/constants/homepageSections";

type AdminHomepageSectionCheckboxesProps = {
  selected?: HomepageSection[];
};

export function AdminHomepageSectionCheckboxes({
  selected = [],
}: AdminHomepageSectionCheckboxesProps) {
  const selectedSet = new Set(selected);

  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:col-span-2">
      <p className="text-sm font-medium text-zinc-800">Homepage sections</p>
      <p className="text-xs text-zinc-500">
        Choose where this post appears on the homepage (Trending / Must Read /
        Special row and Entertainment / Sports / Business row).
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {HOMEPAGE_SECTIONS.map((section) => (
          <label
            key={section.value}
            className="flex items-start gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700"
          >
            <input
              type="checkbox"
              name={section.fieldName}
              defaultChecked={selectedSet.has(section.value)}
              className="mt-0.5 rounded border-zinc-300"
            />
            <span>
              <span className="font-medium">{section.label}</span>
              <span className="mt-0.5 block text-xs text-zinc-500">
                {section.description}
              </span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
