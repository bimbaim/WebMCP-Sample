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
  const handleCategoryChange = (cat: string | null) => {
    onCategoryChange(cat);
  };

  return (
    <form
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      toolname="filter_by_category"
      tooldescription="Lihat semua produk dalam kategori tertentu: elektronik, fashion, atau rumah">
      <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>

      <div className="space-y-3">
        {/* All Products */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="category"
            value=""
            checked={selectedCategory === null}
            onChange={(e) => handleCategoryChange(null)}
            className="w-4 h-4 text-emerald-600"
            toolparamdescription="Pilih kategori: electronics, fashion, atau home"
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
              onChange={() => handleCategoryChange(cat)}
              className="w-4 h-4 text-emerald-600"
              toolparamdescription={`Filter kategori: ${cat}`}
            />
            <span className="text-gray-700 capitalize">
              {cat.replace("-", " ")}
            </span>
          </label>
        ))}
      </div>
    </form>
  );
}
