import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    spec: "webmcp/0.1",
    site: {
      name: "ShopMCP - Sample E-Commerce Store",
      description: "Sample e-commerce with WebMCP and MCP integration",
      pages: [
        {
          url: "/products",
          intents: ["search_products", "filter_by_category", "get_product"],
        },
        {
          url: "/cart",
          intents: ["get_cart", "add_to_cart", "remove_from_cart"],
        },
        {
          url: "/checkout",
          intents: ["checkout", "create_order"],
        },
      ],
    },
    mcp: {
      server: "/api/mcp",
      tools: [
        "list_products",
        "get_product",
        "list_categories",
        "add_to_cart",
        "create_order",
        "get_order_status",
      ],
    },
  });
}
