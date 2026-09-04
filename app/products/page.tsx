"use client";

import { useState, useMemo } from "react";
import { products, searchProducts, getProductsByCategory } from "@/data/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SearchBar } from "@/components/products/SearchBar";
import { ProductFilter } from "@/components/products/ProductFilter";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    let results = products;

    if (searchQuery.trim()) {
      results = searchProducts(searchQuery);
    } else if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory);
    }

    return results;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">
            Explore our collection of {filteredProducts.length} products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-8">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search products by name or description..."
              />
            </div>

            {/* Results count */}
            <div className="mb-6 text-sm text-gray-600">
              {filteredProducts.length === 0
                ? "No products found"
                : `Found ${filteredProducts.length} product${
                    filteredProducts.length === 1 ? "" : "s"
                  }`}
            </div>

            {/* Grid */}
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
