"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function UserSearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-64">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        placeholder="Buscar usuarios..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}