import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "MCP Server is running with tools registered",
    endpoint: "/api/mcp",
    discovery: "/.well-known/webmcp",
    tools: [
      {
        name: "list_products",
        description: "Get all products, optionally filtered by category or search term",
        status: "✅ Active",
      },
      {
        name: "get_product",
        description: "Get detailed information about a specific product",
        status: "✅ Active",
      },
      {
        name: "list_categories",
        description: "Get all available product categories",
        status: "✅ Active",
      },
      {
        name: "add_to_cart",
        description: "Add a product to a shopping cart",
        status: "✅ Active",
      },
      {
        name: "create_order",
        description: "Create a new order with items and customer info",
        status: "✅ Active",
      },
      {
        name: "get_order_status",
        description: "Get the status of an order by its ID",
        status: "✅ Active",
      },
    ],
    browser_tools: {
      status: "requires Chrome 146+",
      tools: [
        "search_products",
        "filter_by_category",
        "get_product",
        "get_cart",
        "add_to_cart",
        "remove_from_cart",
        "checkout",
      ],
    },
    testing: {
      webmcp_discovery: "curl https://web-mcp-sample-xi.vercel.app/.well-known/webmcp",
      mcp_tools_list:
        'curl -X POST https://web-mcp-sample-xi.vercel.app/api/mcp -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" -d \'{"jsonrpc":"2.0","method":"tools/list","id":1}\'',
      this_status: "curl https://web-mcp-sample-xi.vercel.app/api/tools-status",
    },
  });
}
