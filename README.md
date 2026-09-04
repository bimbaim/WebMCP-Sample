# ShopMCP - Sample E-Commerce with WebMCP & MCP Integration

A minimal, production-ready sample e-commerce application demonstrating **WebMCP** (Web Model Context Protocol) and **MCP** (Model Context Protocol) integration with AI agents.

## 🚀 Features

### E-Commerce Core
- **20 Products** across 3 categories (Electronics, Fashion, Home & Living)
- **Search & Filter** — Find products by keyword or category
- **Shopping Cart** — Persistent cart with localStorage sync
- **Checkout** — Fully functional order processing with order confirmation
- **Product Details** — Individual product pages with ratings and stock info

### WebMCP Integration (Browser Layer)

Exposes 7 tools via `navigator.modelContext` (Chrome 146+):

| Tool | Description |
|------|---|
| `search_products` | Search products by keyword |
| `filter_by_category` | Filter products by category |
| `get_product` | Get detailed product info by ID |
| `get_cart` | Retrieve current cart contents |
| `add_to_cart` | Add product to cart |
| `remove_from_cart` | Remove product from cart |
| `checkout` | Place order with customer details |

### MCP Integration (Server Layer)

Server-side MCP endpoint at `/api/mcp` exposes 6 tools:

| Tool | Description |
|------|---|
| `list_products` | Get all products with optional filter |
| `get_product` | Get product details by ID |
| `list_categories` | Get available categories |
| `add_to_cart` | Add product to cart (server-side session tracking) |
| `create_order` | Create new order |
| `get_order_status` | Check order status by ID |

## 📦 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js App Router | 16.3 |
| Language | TypeScript | Latest |
| Styling | Tailwind CSS | Latest |
| State | Zustand | 5.x |
| API Tools | mcp-handler | 2.x |
| MCP SDK | @modelcontextprotocol/server | 2.x |
| Validation | Zod | 4.x |

## 📁 Project Structure

```
sample-web/
├── app/
│   ├── layout.tsx                 # Root layout + WebMCPProvider
│   ├── page.tsx                   # Landing page
│   ├── products/
│   │   ├── page.tsx               # Product listing with search/filter
│   │   └── [id]/page.tsx          # Product detail page
│   ├── cart/page.tsx              # Shopping cart page
│   ├── checkout/
│   │   ├── page.tsx               # Checkout form
│   │   └── success/page.tsx       # Order confirmation
│   ├── api/
│   │   ├── mcp/route.ts           # Server MCP endpoint
│   │   └── checkout/route.ts      # Checkout API
│   └── .well-known/
│       └── webmcp/route.ts        # WebMCP manifest
│
├── components/
│   ├── webmcp/WebMCPProvider.tsx  # Browser tool registration
│   ├── layout/Header.tsx          # Navigation + cart badge
│   ├── products/                  # Product components
│   ├── cart/                      # Cart components
│   └── checkout/CheckoutForm.tsx
│
├── data/products.ts               # Product catalog (20 items)
├── store/cart.ts                  # Zustand cart store
├── types/webmcp.d.ts              # TypeScript declarations
└── lib/utils.ts                   # Helper functions
```

## 🔧 Setup & Usage

### Installation

```bash
# Dependencies already installed
npm install

# Development server
npm run dev
# Open http://localhost:3000
```

### Building for Production

```bash
npm run build
npm start
```

### Testing APIs

**Test WebMCP Manifest:**
```bash
curl http://localhost:3000/.well-known/webmcp
```

**Test Server MCP Endpoint:**
```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

**Test Checkout API:**
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "items": [{ "name": "Product", "quantity": 1, "price": 99.99 }],
    "total": 99.99
  }'
```

## 🤖 WebMCP Features

- **Browser-native** — Uses `navigator.modelContext` (Chrome 146+)
- **Auto-discovery** — WebMCP manifest at `/.well-known/webmcp`
- **7 Browser Tools** — Search, filter, cart, checkout operations
- **5 Server Tools** — MCP endpoint for AI agent integration
- **Declarative & Imperative** — Both HTML attributes and JavaScript registration

## 📊 Data Model

### Product (20 items)
- Electronics: 7 products
- Fashion: 7 products
- Home & Living: 6 products

Each product has: id, name, category, price, image, description, stock, rating

### Cart Items
Persistent via localStorage with Zustand state management

### Orders
In-memory storage with order ID, customer details, items, total, status

## 🎨 Design

- **Color**: Emerald accent with Slate/Zinc neutrals
- **Responsive**: Mobile-first, adapts to tablet/desktop
- **Clean UI**: Minimal styling, Tailwind CSS based

## 📚 References

- **WebMCP**: https://github.com/webmachinelearning/webmcp
- **MCP Protocol**: https://modelcontextprotocol.io
- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com

## 📄 License

MIT - Sample project for demonstration purposes.

---

**Status:** ✓ Development Ready • ✓ All APIs Functional • ✓ WebMCP Tools Registered

**Ready to run:** `npm run dev` → http://localhost:3000
