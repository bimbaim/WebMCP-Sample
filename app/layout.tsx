import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WebMCPProvider } from "@/components/webmcp/WebMCPProvider";
import { Header } from "@/components/layout/Header";
import { FloatingChat } from "@/components/chat/FloatingChat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopMCP - Sample E-Commerce with WebMCP",
  description: "Sample e-commerce platform demonstrating WebMCP and MCP integration",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Register WebMCP tools immediately before React loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (!navigator.modelContext) return;

                const mc = navigator.modelContext;
                const tools = [
                  {
                    name: "search_products",
                    description: "Search for products by keyword or name",
                    inputSchema: {
                      type: "object",
                      properties: {
                        query: {
                          type: "string",
                          description: "Search query (product name or keyword). Example: 'wireless headphones'"
                        }
                      },
                      required: ["query"]
                    }
                  },
                  {
                    name: "filter_by_category",
                    description: "Get all products in a specific category",
                    inputSchema: {
                      type: "object",
                      properties: {
                        category: {
                          type: "string",
                          enum: ["electronics", "fashion", "home"],
                          description: "Product category to filter by"
                        }
                      },
                      required: ["category"]
                    }
                  },
                  {
                    name: "get_product",
                    description: "Get detailed information about a specific product including price, rating, and stock",
                    inputSchema: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          description: "The unique product identifier"
                        }
                      },
                      required: ["id"]
                    }
                  },
                  {
                    name: "get_cart",
                    description: "View the current shopping cart with all items, quantities, and total price",
                    inputSchema: {
                      type: "object",
                      properties: {}
                    }
                  },
                  {
                    name: "add_to_cart",
                    description: "Add a product to the shopping cart with optional quantity",
                    inputSchema: {
                      type: "object",
                      properties: {
                        productId: {
                          type: "string",
                          description: "The unique product identifier to add to cart"
                        },
                        quantity: {
                          type: "number",
                          description: "Number of items to add (default: 1)",
                          default: 1
                        }
                      },
                      required: ["productId"]
                    }
                  },
                  {
                    name: "remove_from_cart",
                    description: "Remove a product from the shopping cart",
                    inputSchema: {
                      type: "object",
                      properties: {
                        productId: {
                          type: "string",
                          description: "The unique product identifier to remove from cart"
                        }
                      },
                      required: ["productId"]
                    }
                  },
                  {
                    name: "checkout",
                    description: "Place an order with customer details and complete the purchase",
                    inputSchema: {
                      type: "object",
                      properties: {
                        customerName: {
                          type: "string",
                          description: "Full name of the customer placing the order"
                        },
                        customerEmail: {
                          type: "string",
                          description: "Email address for order confirmation"
                        }
                      },
                      required: ["customerName", "customerEmail"]
                    }
                  }
                ];

                // Defer registration until modelContext is ready
                let retries = 0;
                const registerTools = () => {
                  try {
                    for (const tool of tools) {
                      mc.registerTool({
                        ...tool,
                        execute: async (args) => {
                          try {
                            // Call the backend MCP server
                            const response = await fetch('/api/mcp', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                jsonrpc: '2.0',
                                method: 'tools/call',
                                params: { name: tool.name, arguments: args },
                                id: Date.now()
                              })
                            });

                            const data = await response.text();
                            // Parse the SSE response
                            const match = data.match(/data: ({.*})/);
                            if (match) {
                              const result = JSON.parse(match[1]);
                              return result.result?.content?.[0]?.text || JSON.stringify(result);
                            }
                            return data;
                          } catch (error) {
                            return JSON.stringify({ error: error.message });
                          }
                        }
                      });
                    }
                    window.__webmcpReady = true;
                    window.__webmcpToolsCount = tools.length;
                    window.dispatchEvent(new CustomEvent('webmcp-ready', { detail: { ready: true, toolsCount: tools.length } }));
                    console.log('%c✅ WebMCP tools registered immediately (7 tools)', 'color: #4caf50; font-weight: bold;');
                  } catch (e) {
                    if (retries++ < 10) {
                      setTimeout(registerTools, 100);
                    }
                  }
                };
                registerTools();
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <WebMCPProvider>
          <Header />
          {children}
          <FloatingChat />
        </WebMCPProvider>
      </body>
    </html>
  );
}
