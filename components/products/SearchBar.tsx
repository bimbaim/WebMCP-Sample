"use client";

import { useState, useCallback } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search products...",
}: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      onSearch(newValue);
    },
    [onSearch]
  );

  return (
    <div className="flex gap-2" toolname="search_products" tooldescription="Search for products by keyword">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        toolparamdescription="Search query (product name or keyword)"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      {value && (
        <button
          onClick={() => {
            setValue("");
            onSearch("");
          }}
          className="px-3 py-2 text-gray-600 hover:text-gray-900"
        >
          Clear
        </button>
      )}
    </div>
  );
}
