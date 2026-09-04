"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Tool {
  name: string;
  description: string;
  status: string;
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await fetch("/api/tools-status");
        const data = await res.json();
        setTools(data.tools || []);
      } catch (err) {
        setError("Failed to load tools status");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🛠️ MCP Tools Status</h1>
          <p className="text-lg text-gray-600">Server-side MCP tools available at /api/mcp</p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-emerald-500 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-semibold text-emerald-900">MCP Server: ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-medium mb-2">Discovery Endpoint:</p>
              <code className="bg-gray-100 p-2 rounded text-gray-900 block break-all">
                /.well-known/webmcp
              </code>
            </div>
            <div>
              <p className="text-gray-600 font-medium mb-2">MCP Server Endpoint:</p>
              <code className="bg-gray-100 p-2 rounded text-gray-900 block break-all">
                /api/mcp
              </code>
            </div>
          </div>
        </div>

        {/* Tools List */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📋</span> Registered Server Tools
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin">⚙️</div>
              <p className="text-gray-600 mt-2">Loading tools...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
          ) : tools.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
              No tools found
            </div>
          ) : (
            <div className="space-y-4">
              {tools.map((tool, idx) => (
                <div key={tool.name} className="border border-gray-200 rounded-lg p-4 hover:bg-emerald-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <span className="text-emerald-600">{idx + 1}.</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{tool.name}</code>
                      </h3>
                      <p className="text-gray-600 mt-2">{tool.description}</p>
                    </div>
                    <div className="ml-4">{tool.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">💡 Total Tools: {tools.length}</p>
            <p className="text-xs text-blue-800">
              All tools are active and ready to be called via the MCP protocol at /api/mcp
            </p>
          </div>
        </div>

        {/* Browser Tools */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>🌐</span> Browser Tools (WebMCP)
          </h2>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
            <p className="text-amber-900 font-medium">⚠️ Requires Chrome 146+</p>
            <p className="text-sm text-amber-800 mt-2">
              Browser tools register at runtime via navigator.modelContext.registerTool()
            </p>
          </div>

          <div className="space-y-2">
            {[
              "search_products",
              "filter_by_category",
              "get_product",
              "get_cart",
              "add_to_cart",
              "remove_from_cart",
              "checkout",
            ].map((name, idx) => (
              <div key={name} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <span className="text-blue-600 font-bold">{idx + 1}.</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-900">{name}</code>
                <span className="ml-auto text-xs text-gray-500">Browser-only</span>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-gray-600">
            <p>
              Open the browser console on the products page to see if WebMCP tools are registering:
            </p>
            <code className="bg-gray-100 p-2 rounded block mt-2 text-gray-900">
              "Registering WebMCP tools..." / "WebMCP tools registered successfully"
            </code>
          </div>
        </div>

        {/* Testing Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>🧪</span> Test Endpoints
          </h2>

          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-900 mb-2">1. WebMCP Discovery</p>
              <code className="bg-gray-100 p-3 rounded block text-xs text-gray-900 overflow-auto">
                curl https://web-mcp-sample-xi.vercel.app/.well-known/webmcp
              </code>
            </div>

            <div>
              <p className="font-medium text-gray-900 mb-2">2. List Tools (MCP Protocol)</p>
              <pre className="bg-gray-100 p-3 rounded block text-xs text-gray-900 overflow-auto whitespace-pre-wrap break-all">
                {`curl -X POST https://web-mcp-sample-xi.vercel.app/api/mcp \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'`}
              </pre>
            </div>

            <div>
              <p className="font-medium text-gray-900 mb-2">3. Tools Status (JSON)</p>
              <code className="bg-gray-100 p-3 rounded block text-xs text-gray-900 overflow-auto">
                curl https://web-mcp-sample-xi.vercel.app/api/tools-status
              </code>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            ← Back to Products
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Home
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-4 bg-gray-100 rounded-lg text-center text-sm text-gray-700">
          <p>
            🚀 All systems operational. Tools are ready for Claude Code and other MCP clients.
          </p>
        </div>
      </div>
    </div>
  );
}
