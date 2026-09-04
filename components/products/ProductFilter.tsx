"use client";

import { categories } from "@/data/products";

interface ProductFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function ProductFilter({
  selectedCategory,
  onCategoryChange,
}: ProductFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" toolname="filter_by_category" tooldescription="Filter products by category">
      <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>

      <div className="space-y-3">
        {/* All Products */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="category"
            checked={selectedCategory === null}
            onChange={() => onCategoryChange(null)}
            className="w-4 h-4 text-emerald-600"
          />
          <span className="text-gray-700">All Products</span>
        </label>

        {/* Category filters */}
        {categories.map((cat) => (
          <label key={cat} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="category"
              value={cat}
              checked={selectedCategory === cat}
              onChange={() => onCategoryChange(cat)}
              className="w-4 h-4 text-emerald-600"
            />
            <span className="text-gray-700 capitalize">
              {cat.replace("-", " ")}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
