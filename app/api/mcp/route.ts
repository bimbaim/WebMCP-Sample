import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  products,
  getProductById,
  getProductsByCategory,
  searchProducts,
  categories,
} from "@/data/products";

// In-memory order storage
const orders = new Map<
  string,
  {
    id: string;
    items: Array<{ productId: string; quantity: number; price: number }>;
    total: number;
    status: "pending" | "confirmed" | "shipped";
    createdAt: Date;
  }
>();

const handler = createMcpHandler((server) => {
  // List all products with optional filtering
  server.registerTool(
    "list_products",
    {
      title: "List Products",
      description: "Get all products, optionally filtered by category or search term",
      inputSchema: z.object({
        category: z.enum(["electronics", "fashion", "home"]).optional(),
        search: z.string().optional(),
      }),
    },
    async ({ category, search }) => {
      let results = products;

      if (search) {
        results = searchProducts(search);
      } else if (category) {
        results = getProductsByCategory(category);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              results.map((p) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                category: p.category,
                rating: p.rating,
                stock: p.stock,
              })),
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Get product details
  server.registerTool(
    "get_product",
    {
      title: "Get Product",
      description: "Get detailed information about a specific product",
      inputSchema: z.object({
        id: z.string().describe("Product ID"),
      }),
    },
    async ({ id }) => {
      const product = getProductById(id);
      if (!product) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "Product not found" }),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(product, null, 2),
          },
        ],
      };
    }
  );

  // List categories
  server.registerTool(
    "list_categories",
    {
      title: "List Categories",
      description: "Get all available product categories",
      inputSchema: z.object({}),
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(categories),
          },
        ],
      };
    }
  );

  // Create order
  server.registerTool(
    "create_order",
    {
      title: "Create Order",
      description: "Create a new order with items and customer info",
      inputSchema: z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number().int().min(1),
          })
        ),
        email: z.string().email(),
        name: z.string(),
      }),
    },
    async ({ items, email, name }) => {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      let total = 0;
      const orderItems = items.map((item) => {
        const product = getProductById(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        return { productId: item.productId, quantity: item.quantity, price: product.price };
      });

      orders.set(orderId, {
        id: orderId,
        items: orderItems,
        total,
        status: "confirmed",
        createdAt: new Date(),
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                orderId,
                status: "confirmed",
                total,
                itemCount: items.length,
                customerName: name,
                customerEmail: email,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Get order status
  server.registerTool(
    "get_order_status",
    {
      title: "Get Order Status",
      description: "Get the status of an order by its ID",
      inputSchema: z.object({
        orderId: z.string(),
      }),
    },
    async ({ orderId }) => {
      const order = orders.get(orderId);
      if (!order) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "Order not found" }),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                id: order.id,
                status: order.status,
                total: order.total,
                itemCount: order.items.length,
                createdAt: order.createdAt.toISOString(),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Add to cart (in-memory cart tracking per session)
  const sessionCarts = new Map<string, Array<{ productId: string; quantity: number }>>();

  server.registerTool(
    "add_to_cart",
    {
      title: "Add to Cart",
      description: "Add a product to a shopping cart (server-side tracking)",
      inputSchema: z.object({
        productId: z.string().describe("Product ID to add"),
        quantity: z.number().int().min(1).default(1).describe("Quantity to add"),
        sessionId: z.string().optional().describe("Session/user ID for cart tracking"),
      }),
    },
    async ({ productId, quantity, sessionId = "default" }) => {
      const product = getProductById(productId);
      if (!product) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: "Product not found" }),
            },
          ],
        };
      }

      if (product.stock < quantity) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: `Only ${product.stock} items in stock` }),
            },
          ],
        };
      }

      // Get or create cart for session
      const cart = sessionCarts.get(sessionId) || [];
      const existingItem = cart.find((item) => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ productId, quantity });
      }

      sessionCarts.set(sessionId, cart);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: `Added ${quantity} of "${product.name}" to cart`,
              cartSize: cart.length,
              totalQuantity: cart.reduce((sum, item) => sum + item.quantity, 0),
            }),
          },
        ],
      };
    }
  );
});

export { handler as GET, handler as POST };
