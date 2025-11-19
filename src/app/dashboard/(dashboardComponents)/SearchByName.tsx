import { Search } from "lucide-react";
import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchByName({ value, onChange, placeholder = "Search by name..." }: Props) {
  return (
  <div className="flex gap-2">
   <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mb-4 px-3 py-2 rounded border border-[#00a0a8] focus:ring-2 focus:ring-[#09879a] outline-none w-full max-w-sm text-base"
    />
    <Search/>
  </div>
   
  );
}
