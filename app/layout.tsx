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
                // WebMCP Imperative API: document.modelContext (navigator.modelContext deprecated in Chrome 150)
                if (!document.modelContext) {
                  console.log('WebMCP document.modelContext not available');
                  return;
                }
                const tools = [
                  {
                    name: "search_products",
                    description: "Cari produk berdasarkan nama atau kata kunci",
                    inputSchema: {
                      type: "object",
                      properties: {
                        query: {
                          type: "string",
                          description: "Kata kunci pencarian. Contoh: 'wireless', 'keyboard', 'dress'"
                        }
                      },
                      required: ["query"]
                    },
                    outputSchema: {
                      type: "string",
                      description: "JSON array of products matching the search query"
                    }
                  },
                  {
                    name: "filter_by_category",
                    description: "Lihat semua produk dalam kategori tertentu: elektronik, fashion, atau rumah",
                    inputSchema: {
                      type: "object",
                      properties: {
                        category: {
                          type: "string",
                          enum: ["electronics", "fashion", "home"],
                          description: "Kategori: electronics (elektronik), fashion (pakaian), atau home (rumah tangga)"
                        }
                      },
                      required: ["category"]
                    },
                    outputSchema: {
                      type: "string",
                      description: "JSON array of products in the selected category"
                    }
                  },
                  {
                    name: "get_product",
                    description: "Dapatkan detail lengkap produk tertentu dengan harga, rating, stok, dan deskripsi",
                    inputSchema: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          description: "ID produk. Format: elec-001, fash-001, home-001 dll"
                        }
                      },
                      required: ["id"]
                    },
                    outputSchema: {
                      type: "string",
                      description: "JSON object with complete product details including name, price, rating, stock, description"
                    }
                  },
                  {
                    name: "get_cart",
                    description: "Lihat isi keranjang belanja saat ini dengan jumlah item dan total harga",
                    inputSchema: {
                      type: "object",
                      properties: {}
                    },
                    outputSchema: {
                      type: "string",
                      description: "JSON object with cart items, quantities, and total price"
                    }
                  },
                  {
                    name: "add_to_cart",
                    description: "Tambahkan produk ke keranjang belanja",
                    inputSchema: {
                      type: "object",
                      properties: {
                        productId: {
                          type: "string",
                          description: "ID produk yang akan ditambahkan. Contoh: elec-001"
                        }
                      },
                      required: ["productId"]
                    },
                    outputSchema: {
                      type: "string",
                      description: "JSON object confirming product was added with success status and cart size"
                    }
                  },
                  {
                    name: "remove_from_cart",
                    description: "Hapus produk dari keranjang belanja",
                    inputSchema: {
                      type: "object",
                      properties: {
                        productId: {
                          type: "string",
                          description: "ID produk yang akan dihapus dari keranjang"
                        }
                      },
                      required: ["productId"]
                    },
                    outputSchema: {
                      type: "string",
                      description: "JSON object confirming product was removed from cart"
                    }
                  },
                  {
                    name: "checkout",
                    description: "Lakukan checkout dan buat pesanan baru",
                    inputSchema: {
                      type: "object",
                      properties: {
                        customerName: {
                          type: "string",
                          description: "Nama lengkap pelanggan"
                        },
                        customerEmail: {
                          type: "string",
                          description: "Email untuk konfirmasi pesanan"
                        }
                      },
                      required: ["customerName", "customerEmail"]
                    },
                    outputSchema: {
                      type: "string",
                      description: "JSON object with order confirmation including orderId, status, and total price"
                    }
                  }
                ];

                // Register tools using navigator.registerTool API
                // Signature: navigator.registerTool(toolDefinition)
                // toolDefinition MUST include 'name' property
                let registeredCount = 0;

                for (const tool of tools) {
                  try {
                    document.modelContext.registerTool({
                      name: tool.name,
                      title: tool.name.replace(/_/g, ' ').toUpperCase(),
                      description: tool.description,
                      inputSchema: tool.inputSchema,
                      annotations: {
                        readOnlyHint: ['search_products', 'filter_by_category', 'get_product', 'get_cart'].includes(tool.name),
                        consequentialHint: ['checkout', 'add_to_cart', 'remove_from_cart'].includes(tool.name),
                        untrustedContentHint: false
                      },
                      execute: async (args, { signal }) => {
                        try {
                          // Map frontend tool names to backend tool names
                          let backendToolName = tool.name;
                          let backendArgs = args;

                          // Handle mapping
                          if (tool.name === 'search_products') {
                            backendToolName = 'list_products';
                            backendArgs = { search: args.query };
                          } else if (tool.name === 'filter_by_category') {
                            backendToolName = 'list_products';
                            backendArgs = { category: args.category };
                          } else if (tool.name === 'checkout') {
                            backendToolName = 'create_order';
                            // checkout needs items from cart, but we don't have that
                            return JSON.stringify({ error: 'Checkout requires cart data - use via website' });
                          } else if (tool.name === 'get_cart' || tool.name === 'remove_from_cart') {
                            // These are client-side only tools
                            return JSON.stringify({ message: 'This is a client-side tool' });
                          }

                          // Call the backend MCP server with cancellation support
                          const response = await fetch('/api/mcp', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              jsonrpc: '2.0',
                              method: 'tools/call',
                              params: { name: backendToolName, arguments: backendArgs },
                              id: Date.now()
                            }),
                            signal: signal
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
                          if (error.name === 'AbortError') {
                            return JSON.stringify({ cancelled: true, message: 'Tool execution cancelled by user or agent' });
                          }
                          return JSON.stringify({ error: error.message });
                        }
                      }
                    });
                    registeredCount++;
                  } catch (e) {
                    console.log('Failed to register tool ' + tool.name + ':', e.message);
                  }
                }

                if (registeredCount > 0) {
                  window.__webmcpReady = true;
                  window.__webmcpToolsCount = registeredCount;
                  window.dispatchEvent(new CustomEvent('webmcp-ready', { detail: { ready: true, toolsCount: registeredCount } }));
                  console.log('%c✅ WebMCP tools registered (' + registeredCount + ' tools)', 'color: #4caf50; font-weight: bold;');

                  // Listen for tool changes
                  document.modelContext.addEventListener('toolchange', () => {
                    console.log('%c🔄 Available tools have changed', 'color: #2196f3');
                  });
                } else {
                  console.warn('%c⚠️ No tools registered', 'color: #ff9800;');
                }
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
