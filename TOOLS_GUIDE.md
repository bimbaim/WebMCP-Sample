# WebMCP & MCP Tools Guide

## 🚀 You're All Set!

Your deployment at **https://web-mcp-sample-xi.vercel.app** has **6 server-side MCP tools** and **7 browser-based WebMCP tools** fully operational.

---

## 📊 What Tools Are Available?

### 1️⃣ Server-Side MCP Tools (Backend)

These are available at `/api/mcp` endpoint for any MCP client:

| Tool | Purpose | Type |
|------|---------|------|
| `list_products` | Get all products (with optional filtering) | Query |
| `get_product` | Get details for a specific product | Query |
| `list_categories` | Get available categories | Query |
| `add_to_cart` | Add product to server-side cart | Action |
| `create_order` | Create an order with customer info | Action |
| `get_order_status` | Check order status by ID | Query |

**Test it:**
```bash
curl -X POST https://web-mcp-sample-xi.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

### 2️⃣ Browser-Based WebMCP Tools (Frontend)

These require **Chrome 146+** and register via `navigator.modelContext`:

| Tool | Purpose | Type |
|------|---------|------|
| `search_products` | Search by keyword (client-side) | Query |
| `filter_by_category` | Filter by category (client-side) | Query |
| `get_product` | Get product details (client-side) | Query |
| `get_cart` | View current shopping cart | Query |
| `add_to_cart` | Add to browser's local cart | Action |
| `remove_from_cart` | Remove from browser's local cart | Action |
| `checkout` | Complete order with customer details | Action |

---

## ✅ How to Verify Everything is Working

### Option 1: Use the Tools Status Page

Visit: **https://web-mcp-sample-xi.vercel.app/tools**

This page shows:
- ✅ Server status
- ✅ All registered tools
- ✅ Browser tool availability
- ✅ Test commands

### Option 2: Check the API Directly

```bash
# 1. Discovery manifest
curl https://web-mcp-sample-xi.vercel.app/.well-known/webmcp

# 2. JSON tools status
curl https://web-mcp-sample-xi.vercel.app/api/tools-status

# 3. Full MCP protocol test
curl -X POST https://web-mcp-sample-xi.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

### Option 3: Check Browser Console

1. Go to **https://web-mcp-sample-xi.vercel.app/products**
2. Open DevTools (F12 or Cmd+Option+I)
3. Check the **Console** tab

You'll see one of two messages:

**✅ If Chrome 146+ with WebMCP:**
```
✅ WebMCP Available
Registering WebMCP tools...
✅ WebMCP tools registered successfully (7 tools)
```

**⚠️ If older browser:**
```
⚠️ WebMCP NOT Available
Navigator.modelContext is undefined
This requires Chrome 146+ with WebMCP support enabled.
But don't worry!
Server-side MCP tools are still available at /api/mcp
```

---

## 🔧 Using with Claude Code

### Method 1: Direct MCP Connection

If you have Claude Code installed:

1. Open Claude Code
2. Go to **File → Add MCP Server**
3. Choose **HTTP Server**
4. Enter URL: `https://web-mcp-sample-xi.vercel.app/api/mcp`
5. Click **Connect**

Claude Code will automatically:
- Discover all 6 server-side tools
- Make them available in the chat
- Handle the MCP protocol communication

### Method 2: WebMCP in Browser

If using a Chrome 146+ browser with WebMCP support:

1. Visit **https://web-mcp-sample-xi.vercel.app**
2. Open Claude (in browser or Claude Code)
3. Claude will auto-discover:
   - The WebMCP manifest at `/.well-known/webmcp`
   - Browser tools via `navigator.modelContext`
4. Tools appear automatically in the chat

---

## 📡 API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/.well-known/webmcp` | GET | WebMCP discovery manifest |
| `/api/mcp` | POST | MCP server (JSON-RPC 2.0) |
| `/api/tools-status` | GET | Tool status & diagnostics |
| `/tools` | GET | Visual tools dashboard |

---

## 🎯 Example: Using a Tool

### Via cURL (Server MCP)

**List all products:**
```bash
curl -X POST https://web-mcp-sample-xi.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "list_products"
    },
    "id": 1
  }'
```

**Search for electronics:**
```bash
curl -X POST https://web-mcp-sample-xi.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "list_products",
      "arguments": {
        "category": "electronics"
      }
    },
    "id": 2
  }'
```

---

## 🐛 Troubleshooting

### "No tools registered yet" Message

**Possible causes:**

1. **Browser doesn't support WebMCP** (< Chrome 146)
   - Solution: Use Chrome 146+ or rely on server-side MCP tools
   - Check: `navigator.modelContext` in DevTools Console

2. **MCP client not connecting properly**
   - Solution: Verify `/api/mcp` endpoint is accessible
   - Test: See API endpoints section above

3. **Discovery endpoint not working**
   - Solution: Verify `/.well-known/webmcp` returns manifest
   - Test: `curl https://web-mcp-sample-xi.vercel.app/.well-known/webmcp`

### Missing Accept Headers

If you get: `"Client must accept both application/json and text/event-stream"`

- Include headers: `-H "Accept: application/json, text/event-stream"`

### Tools Not Appearing in Claude Code

1. Check MCP server is running: `/api/tools-status`
2. Verify connection in Claude Code settings
3. Restart Claude Code if needed
4. Check Claude Code version supports MCP

---

## 📚 Architecture

```
┌─────────────────────────────────────────────────────┐
│         Web Browser (Chrome 146+)                   │
│  ┌────────────────────────────────────────────────┐ │
│  │   navigator.modelContext.registerTool()        │ │
│  │   • search_products                            │ │
│  │   • filter_by_category                         │ │
│  │   • get_product                                │ │
│  │   • get_cart / add_to_cart / remove_from_cart  │ │
│  │   • checkout                                   │ │
│  └────────────────────────────────────────────────┘ │
│                    ↓ (WebMCP Protocol)              │
│              Browser discovers tools                │
│              when agent visits the site             │
└─────────────────────────────────────────────────────┘
                      ↕
         https://web-mcp-sample-xi.vercel.app
                      ↕
┌─────────────────────────────────────────────────────┐
│       MCP Server at /api/mcp                        │
│  ┌────────────────────────────────────────────────┐ │
│  │  mcp-handler registered tools:                 │ │
│  │  • list_products                               │ │
│  │  • get_product                                 │ │
│  │  • list_categories                             │ │
│  │  • add_to_cart                                 │ │
│  │  • create_order                                │ │
│  │  • get_order_status                            │ │
│  └────────────────────────────────────────────────┘ │
│                                                     │
│  Discovery: /.well-known/webmcp                    │
│  Status: /api/tools-status                         │
└─────────────────────────────────────────────────────┘
                      ↓
            Any MCP Client (Claude Code, etc)
            makes tool calls via HTTP
```

---

## ✨ Features

- ✅ 6 Server-side MCP tools (backend/API)
- ✅ 7 Browser-based WebMCP tools (client-side)
- ✅ Full WebMCP discovery manifest
- ✅ JSON-RPC 2.0 MCP protocol support
- ✅ Server-Sent Events for streaming
- ✅ Session-based cart tracking
- ✅ Order management
- ✅ Product search & filtering
- ✅ Zero configuration required
- ✅ Vercel production-ready

---

## 🚀 Next Steps

1. **Visit** https://web-mcp-sample-xi.vercel.app/tools to see status
2. **Connect** Claude Code to the MCP server (see Method 1 above)
3. **Ask Claude** to search products, add to cart, create orders
4. **Check DevTools** console for WebMCP registration logs
5. **Test APIs** using curl commands from the Tools Status page

---

**Questions?** Check the `/tools` page for live diagnostics and test commands!
