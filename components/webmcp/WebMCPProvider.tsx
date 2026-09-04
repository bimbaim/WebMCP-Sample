"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/store/cart";
import { products, getProductById, searchProducts, getProductsByCategory } from "@/data/products";

export function WebMCPProvider({ children }: { children: React.ReactNode }) {
  const cart = useCart();
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current || typeof navigator === "undefined") return;
    initRef.current = true;

    const mc = navigator.modelContext;
    if (!mc) {
      console.warn(
        "%c⚠️ WebMCP NOT Available",
        "color: #ff9800; font-weight: bold; font-size: 12px;"
      );
      console.log(
        "%cNavigator.modelContext is undefined",
        "color: #ff9800",
        "This requires Chrome 146+ with WebMCP support enabled."
      );
      console.log(
        "%cBut don't worry!",
        "color: #4caf50",
        "Server-side MCP tools are still available at /api/mcp"
      );
      return;
    }

    console.log(
      "%c✅ WebMCP Available",
      "color: #4caf50; font-weight: bold; font-size: 12px;"
    );
    console.log("Registering WebMCP tools...");

    // Tool 1: Search products
    mc.registerTool({
      name: "search_products",
      description: "Search for products by keyword",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query (product name or keyword)",
          },
        },
        required: ["query"],
      },
      execute: async ({ query }) => {
        const results = searchProducts(query);
        return JSON.stringify(
          results.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            rating: p.rating,
          }))
        );
      },
    });

    // Tool 2: Filter by category
    mc.registerTool({
      name: "filter_by_category",
      description: "Get all products in a specific category",
      inputSchema: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["electronics", "fashion", "home"],
            description: "Product category",
          },
        },
        required: ["category"],
      },
      execute: async ({ category }) => {
        const results = getProductsByCategory(category);
        return JSON.stringify(
          results.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            rating: p.rating,
          }))
        );
      },
    });

    // Tool 3: Get product details
    mc.registerTool({
      name: "get_product",
      description: "Get detailed information about a specific product",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Product ID",
          },
        },
        required: ["id"],
      },
      execute: async ({ id }) => {
        const product = getProductById(id);
        if (!product) return JSON.stringify({ error: "Product not found" });
        return JSON.stringify(product);
      },
    });

    // Tool 4: Get cart contents
    mc.registerTool({
      name: "get_cart",
      description: "Get current shopping cart items and total",
      inputSchema: {
        type: "object",
        properties: {},
      },
      execute: async () => {
        const state = useCart.getState();
        return JSON.stringify({
          items: state.items,
          total: state.getTotal(),
          itemCount: state.getItemCount(),
        });
      },
    });

    // Tool 5: Add to cart
    mc.registerTool({
      name: "add_to_cart",
      description: "Add a product to the shopping cart",
      inputSchema: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "Product ID to add",
          },
        },
        required: ["productId"],
      },
      execute: async ({ productId }) => {
        const product = getProductById(productId);
        if (!product) return JSON.stringify({ error: "Product not found" });

        cart.addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        });

        return JSON.stringify({ success: true, message: "Product added to cart" });
      },
    });

    // Tool 6: Remove from cart
    mc.registerTool({
      name: "remove_from_cart",
      description: "Remove a product from the shopping cart",
      inputSchema: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "Product ID to remove",
          },
        },
        required: ["productId"],
      },
      execute: async ({ productId }) => {
        cart.removeItem(productId);
        return JSON.stringify({ success: true, message: "Product removed from cart" });
      },
    });

    // Tool 7: Checkout (place order)
    mc.registerTool({
      name: "checkout",
      description: "Place an order with customer details",
      inputSchema: {
        type: "object",
        properties: {
          customerName: {
            type: "string",
            description: "Customer full name",
          },
          customerEmail: {
            type: "string",
            description: "Customer email address",
          },
        },
        required: ["customerName", "customerEmail"],
      },
      execute: async ({ customerName, customerEmail }) => {
        const state = useCart.getState();
        if (state.items.length === 0) {
          return JSON.stringify({ error: "Cart is empty" });
        }

        try {
          const response = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerName,
              customerEmail,
              items: state.items,
              total: state.getTotal(),
            }),
          });

          const result = await response.json();

          if (response.ok) {
            useCart.getState().clearCart();
            return JSON.stringify({
              success: true,
              orderId: result.orderId,
              message: "Order placed successfully",
            });
          } else {
            return JSON.stringify({ error: result.error });
          }
        } catch (error) {
          return JSON.stringify({ error: "Checkout failed" });
        }
      },
    });

    console.log(
      "%c✅ WebMCP tools registered successfully (7 tools)",
      "color: #4caf50; font-weight: bold;"
    );
    console.table([
      { Tool: "search_products", Type: "Browser" },
      { Tool: "filter_by_category", Type: "Browser" },
      { Tool: "get_product", Type: "Browser" },
      { Tool: "get_cart", Type: "Browser" },
      { Tool: "add_to_cart", Type: "Browser" },
      { Tool: "remove_from_cart", Type: "Browser" },
      { Tool: "checkout", Type: "Browser" },
    ]);
    console.log(
      "%cServer-side MCP endpoint available at /api/mcp (6 additional tools)",
      "color: #2196f3"
    );
  }, [cart]);

  return <>{children}</>;
}
