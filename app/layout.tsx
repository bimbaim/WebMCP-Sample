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
                    description: "Search for products by keyword",
                    inputSchema: {
                      type: "object",
                      properties: { query: { type: "string", description: "Search query" } },
                      required: ["query"]
                    }
                  },
                  {
                    name: "filter_by_category",
                    description: "Get products in a specific category",
                    inputSchema: {
                      type: "object",
                      properties: { category: { type: "string", enum: ["electronics", "fashion", "home"] } },
                      required: ["category"]
                    }
                  },
                  {
                    name: "get_product",
                    description: "Get detailed information about a product",
                    inputSchema: {
                      type: "object",
                      properties: { id: { type: "string", description: "Product ID" } },
                      required: ["id"]
                    }
                  },
                  {
                    name: "get_cart",
                    description: "View current shopping cart",
                    inputSchema: { type: "object", properties: {} }
                  },
                  {
                    name: "add_to_cart",
                    description: "Add product to cart",
                    inputSchema: {
                      type: "object",
                      properties: { productId: { type: "string", description: "Product ID" } },
                      required: ["productId"]
                    }
                  },
                  {
                    name: "remove_from_cart",
                    description: "Remove product from cart",
                    inputSchema: {
                      type: "object",
                      properties: { productId: { type: "string", description: "Product ID" } },
                      required: ["productId"]
                    }
                  },
                  {
                    name: "checkout",
                    description: "Place an order",
                    inputSchema: {
                      type: "object",
                      properties: {
                        customerName: { type: "string" },
                        customerEmail: { type: "string" }
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
                        execute: async (args) => JSON.stringify({ registered: true, tool: tool.name })
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
