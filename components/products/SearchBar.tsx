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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2"
      toolname="search_products"
      tooldescription="Cari produk berdasarkan nama atau kata kunci">
      <input
        type="text"
        name="query"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        toolparamdescription="Kata kunci pencarian. Contoh: 'wireless', 'keyboard', 'dress'"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      {value && (
        <button
          type="reset"
          onClick={() => {
            setValue("");
            onSearch("");
          }}
          className="px-3 py-2 text-gray-600 hover:text-gray-900"
        >
          Clear
        </button>
      )}
    </form>
  );
}
