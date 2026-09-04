export type ParsedCommand = {
  tool: string;
  args: Record<string, any>;
};

const categories = ["electronics", "fashion", "home"];

export function parseChatInput(input: string): ParsedCommand {
  const lower = input.toLowerCase().trim();

  // Search: "search wireless" or "find wireless"
  if (lower.startsWith("search ") || lower.startsWith("find ")) {
    const query = lower.replace(/^(search|find)\s+/, "").trim();
    return {
      tool: "list_products",
      args: { search: query },
    };
  }

  // Filter: "show electronics" or "filter electronics"
  if (lower.startsWith("show ") || lower.startsWith("filter ")) {
    const cat = lower.replace(/^(show|filter)\s+/, "").trim();
    if (categories.includes(cat)) {
      return {
        tool: "list_products",
        args: { category: cat },
      };
    }
  }

  // Product details: "details elec-001" or "tell me about elec-001" or "what is elec-001"
  if (
    lower.startsWith("details ") ||
    lower.startsWith("about ") ||
    lower.includes("elec-") ||
    lower.includes("fash-") ||
    lower.includes("home-")
  ) {
    const match = input.match(/(elec-\d{3}|fash-\d{3}|home-\d{3})/i);
    if (match) {
      return {
        tool: "get_product",
        args: { id: match[0].toLowerCase() },
      };
    }
  }

  // Show all categories
  if (lower === "categories" || lower === "show categories") {
    return {
      tool: "list_products",
      args: {},
    };
  }

  // Default: search
  return {
    tool: "list_products",
    args: { search: input },
  };
}
