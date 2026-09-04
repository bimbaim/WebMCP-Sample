"use client";

import { useState, useEffect } from "react";

interface ToolInfo {
  name: string;
  title: string;
  description: string;
  inputSchema?: {
    properties?: Record<string, any>;
    required?: string[];
  };
  outputSchema?: {
    description: string;
  };
}

export default function WebMCPToolsPage() {
  const [tools, setTools] = useState<ToolInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define all WebMCP tools
    const allTools: ToolInfo[] = [
      {
        name: "search_products",
        title: "Search Products",
        description: "Cari produk berdasarkan nama atau kata kunci",
        inputSchema: {
          properties: {
            query: {
              type: "string",
              description: "Kata kunci pencarian. Contoh: 'wireless', 'keyboard', 'dress'",
            },
          },
          required: ["query"],
        },
        outputSchema: {
          description: "JSON array of products matching the search query",
        },
      },
      {
        name: "filter_by_category",
        title: "Filter by Category",
        description: "Lihat semua produk dalam kategori tertentu: elektronik, fashion, atau rumah",
        inputSchema: {
          properties: {
            category: {
              type: "string",
              enum: ["electronics", "fashion", "home"],
              description: "Kategori: electronics (elektronik), fashion (pakaian), atau home (rumah tangga)",
            },
          },
          required: ["category"],
        },
        outputSchema: {
          description: "JSON array of products in the selected category",
        },
      },
      {
        name: "get_product",
        title: "Get Product Details",
        description: "Dapatkan detail lengkap produk tertentu dengan harga, rating, stok, dan deskripsi",
        inputSchema: {
          properties: {
            id: {
              type: "string",
              description: "ID produk. Format: elec-001, fash-001, home-001 dll",
            },
          },
          required: ["id"],
        },
        outputSchema: {
          description: "JSON object with complete product details including name, price, rating, stock, description",
        },
      },
      {
        name: "get_cart",
        title: "View Shopping Cart",
        description: "Lihat isi keranjang belanja saat ini dengan jumlah item dan total harga",
        inputSchema: {
          properties: {},
          required: [],
        },
        outputSchema: {
          description: "JSON object with cart items, quantities, and total price",
        },
      },
      {
        name: "add_to_cart",
        title: "Add to Cart",
        description: "Tambahkan produk ke keranjang belanja",
        inputSchema: {
          properties: {
            productId: {
              type: "string",
              description: "ID produk yang akan ditambahkan. Contoh: elec-001",
            },
          },
          required: ["productId"],
        },
        outputSchema: {
          description: "JSON object confirming product was added with success status and cart size",
        },
      },
      {
        name: "remove_from_cart",
        title: "Remove from Cart",
        description: "Hapus produk dari keranjang belanja",
        inputSchema: {
          properties: {
            productId: {
              type: "string",
              description: "ID produk yang akan dihapus dari keranjang",
            },
          },
          required: ["productId"],
        },
        outputSchema: {
          description: "JSON object confirming product was removed from cart",
        },
      },
      {
        name: "checkout",
        title: "Checkout Order",
        description: "Lakukan checkout dan buat pesanan baru",
        inputSchema: {
          properties: {
            customerName: {
              type: "string",
              description: "Nama lengkap pelanggan",
            },
            customerEmail: {
              type: "string",
              description: "Email untuk konfirmasi pesanan",
            },
          },
          required: ["customerName", "customerEmail"],
        },
        outputSchema: {
          description: "JSON object with order confirmation including orderId, status, and total price",
        },
      },
    ];

    setTools(allTools);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading tools...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🛠️ WebMCP Tools Reference</h1>
          <p className="text-lg text-gray-600">Complete documentation of all available WebMCP tools</p>
        </div>

        {/* Tools Grid */}
        <div className="space-y-8">
          {tools.map((tool, idx) => (
            <div key={tool.name} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              {/* Tool Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold">#{idx + 1}</span>
                      <code className="bg-blue-800 px-3 py-1 rounded font-mono text-sm">{tool.name}</code>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{tool.title}</h2>
                    <p className="text-blue-100">{tool.description}</p>
                  </div>
                </div>
              </div>

              {/* Tool Content */}
              <div className="p-6 space-y-6">
                {/* Input Parameters */}
                {tool.inputSchema && Object.keys(tool.inputSchema.properties || {}).length > 0 ? (
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📥 Input Parameters</h3>
                    <div className="space-y-3">
                      {Object.entries(tool.inputSchema.properties || {}).map(([paramName, paramDef]: [string, any]) => (
                        <div key={paramName} className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <code className="bg-green-200 text-green-900 px-2 py-1 rounded font-mono font-bold">
                              {paramName}
                            </code>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              tool.inputSchema?.required?.includes(paramName)
                                ? "bg-red-200 text-red-900"
                                : "bg-yellow-200 text-yellow-900"
                            }`}>
                              {tool.inputSchema?.required?.includes(paramName) ? "REQUIRED" : "OPTIONAL"}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{paramDef.description}</p>
                          <div className="text-sm text-gray-600">
                            <p>
                              <strong>Type:</strong> {paramDef.type}
                            </p>
                            {paramDef.enum && (
                              <p>
                                <strong>Values:</strong> {paramDef.enum.join(", ")}
                              </p>
                            )}
                            {paramDef.default !== undefined && (
                              <p>
                                <strong>Default:</strong> {paramDef.default}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600">ℹ️ No input parameters required</p>
                  </div>
                )}

                {/* Output Schema */}
                {tool.outputSchema && (
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📤 Output</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-gray-700">{tool.outputSchema.description}</p>
                    </div>
                  </div>
                )}

                {/* Example Usage */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Example Usage</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`navigator.registerTool({
  name: "${tool.name}",
  description: "${tool.description}",
  inputSchema: ${JSON.stringify(tool.inputSchema, null, 2)},
  execute: async (args) => { ... }
})`}</pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Tools Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{tools.length}</p>
              <p className="text-gray-600">Total Tools</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {tools.reduce((sum, t) => sum + ((t.inputSchema?.required) ? t.inputSchema.required.length : 0), 0)}
              </p>
              <p className="text-gray-600">Required Params</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">
                {tools.reduce((sum, t) => sum + (t.inputSchema?.properties ? Object.keys(t.inputSchema.properties).length : 0), 0)}
              </p>
              <p className="text-gray-600">Total Params</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">✅</p>
              <p className="text-gray-600">All Documented</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="/products"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            ← Back to Products
          </a>
        </div>
      </div>
    </div>
  );
}
