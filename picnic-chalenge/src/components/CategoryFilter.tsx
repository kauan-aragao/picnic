"use client";
import { ALL_CATEGORIES } from "@/utils/categorize";
import { MultiSelect } from "@/components/ui/multi-select";

interface Props {
  selected: string[];
  onChange: (value: string[]) => void;
}

export default function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1 text-sm font-medium w-60">
      <span>Filter by categories</span>
      <MultiSelect
        options={ALL_CATEGORIES.map((c) => ({ label: c.en, value: c.id }))}
        value={selected}
        onChange={onChange}
      />
    </div>
  );
}
