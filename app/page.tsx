import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to ShopMCP
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Sample e-commerce platform demonstrating WebMCP and MCP integration
        </p>
        <p className="text-gray-500 mb-8">
          AI agents can discover and interact with products, cart, and checkout via MCP tools
        </p>

        <Link
          href="/products"
          className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors"
        >
          Shop Now
        </Link>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              20 Products
            </h3>
            <p className="text-gray-600">
              Across 3 categories: Electronics, Fashion, and Home & Living
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Search & Filter
            </h3>
            <p className="text-gray-600">
              Find products by keyword or browse by category
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              WebMCP + MCP
            </h3>
            <p className="text-gray-600">
              AI agents can interact with products, cart, and checkout
            </p>
          </div>
        </div>
      </div>

      {/* WebMCP Info */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">About WebMCP</h3>
          <ul className="text-blue-800 space-y-2">
            <li className="flex gap-3">
              <span>✓</span>
              <span>Browser-native protocol (Chrome 146+) via navigator.modelContext</span>
            </li>
            <li className="flex gap-3">
              <span>✓</span>
              <span>AI agents can discover and call tools exposed by websites</span>
            </li>
            <li className="flex gap-3">
              <span>✓</span>
              <span>
                This store exposes 7 browser tools: search, filter, cart operations,
                checkout
              </span>
            </li>
            <li className="flex gap-3">
              <span>✓</span>
              <span>Server-side MCP endpoint at /api/mcp for agent integration</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to explore?
        </h2>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/products"
            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Browse Products
          </Link>
          <Link
            href="/tools"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            🛠️ View Tools Status
          </Link>
        </div>
      </div>
    </div>
  );
}
