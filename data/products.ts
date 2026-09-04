export type Product = {
  id: string;
  name: string;
  category: "electronics" | "fashion" | "home";
  price: number;
  image: string;
  description: string;
  stock: number;
  rating: number;
};

export const categories = ["electronics", "fashion", "home"] as const;

export const products: Product[] = [
  // Electronics (7)
  {
    id: "elec-001",
    name: "Wireless Headphones",
    category: "electronics",
    price: 79.99,
    image: "https://picsum.photos/400/300?random=1",
    description: "Premium wireless headphones with active noise cancellation",
    stock: 15,
    rating: 4.5,
  },
  {
    id: "elec-002",
    name: "USB-C Hub",
    category: "electronics",
    price: 49.99,
    image: "https://picsum.photos/400/300?random=2",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader",
    stock: 8,
    rating: 4.2,
  },
  {
    id: "elec-003",
    name: "Mechanical Keyboard",
    category: "electronics",
    price: 129.99,
    image: "https://picsum.photos/400/300?random=3",
    description: "RGB mechanical keyboard with Cherry MX switches",
    stock: 12,
    rating: 4.7,
  },
  {
    id: "elec-004",
    name: "4K Webcam",
    category: "electronics",
    price: 99.99,
    image: "https://picsum.photos/400/300?random=4",
    description: "Ultra HD 4K webcam with auto-focus and noise reduction",
    stock: 6,
    rating: 4.3,
  },
  {
    id: "elec-005",
    name: "Portable SSD 1TB",
    category: "electronics",
    price: 149.99,
    image: "https://picsum.photos/400/300?random=5",
    description: "Ultra-fast 1TB portable SSD with USB 3.2",
    stock: 10,
    rating: 4.6,
  },
  {
    id: "elec-006",
    name: "Wireless Mouse",
    category: "electronics",
    price: 39.99,
    image: "https://picsum.photos/400/300?random=6",
    description: "Ergonomic wireless mouse with precision tracking",
    stock: 20,
    rating: 4.1,
  },
  {
    id: "elec-007",
    name: "Phone Stand",
    category: "electronics",
    price: 19.99,
    image: "https://picsum.photos/400/300?random=7",
    description: "Adjustable phone stand for desk or table",
    stock: 25,
    rating: 4.0,
  },

  // Fashion (7)
  {
    id: "fash-001",
    name: "Running Shoes",
    category: "fashion",
    price: 119.99,
    image: "https://picsum.photos/400/300?random=8",
    description: "Comfortable running shoes with gel cushioning",
    stock: 18,
    rating: 4.4,
  },
  {
    id: "fash-002",
    name: "Winter Jacket",
    category: "fashion",
    price: 189.99,
    image: "https://picsum.photos/400/300?random=9",
    description: "Waterproof winter jacket with thermal lining",
    stock: 9,
    rating: 4.6,
  },
  {
    id: "fash-003",
    name: "Cotton T-Shirt",
    category: "fashion",
    price: 29.99,
    image: "https://picsum.photos/400/300?random=10",
    description: "Soft premium cotton t-shirt (multiple colors)",
    stock: 40,
    rating: 4.3,
  },
  {
    id: "fash-004",
    name: "Denim Jeans",
    category: "fashion",
    price: 79.99,
    image: "https://picsum.photos/400/300?random=11",
    description: "Classic dark denim jeans with comfortable fit",
    stock: 22,
    rating: 4.2,
  },
  {
    id: "fash-005",
    name: "Baseball Cap",
    category: "fashion",
    price: 24.99,
    image: "https://picsum.photos/400/300?random=12",
    description: "Classic baseball cap with adjustable strap",
    stock: 30,
    rating: 3.9,
  },
  {
    id: "fash-006",
    name: "Sunglasses",
    category: "fashion",
    price: 89.99,
    image: "https://picsum.photos/400/300?random=13",
    description: "UV-protective sunglasses with polarized lenses",
    stock: 14,
    rating: 4.5,
  },
  {
    id: "fash-007",
    name: "Hoodie",
    category: "fashion",
    price: 59.99,
    image: "https://picsum.photos/400/300?random=14",
    description: "Cozy hoodie in classic black and gray colors",
    stock: 16,
    rating: 4.4,
  },

  // Home & Living (6)
  {
    id: "home-001",
    name: "Desk Lamp LED",
    category: "home",
    price: 49.99,
    image: "https://picsum.photos/400/300?random=15",
    description: "Adjustable LED desk lamp with dimming control",
    stock: 11,
    rating: 4.3,
  },
  {
    id: "home-002",
    name: "Coffee Maker",
    category: "home",
    price: 99.99,
    image: "https://picsum.photos/400/300?random=16",
    description: "Programmable coffee maker with thermal carafe",
    stock: 7,
    rating: 4.5,
  },
  {
    id: "home-003",
    name: "Throw Pillow Set",
    category: "home",
    price: 34.99,
    image: "https://picsum.photos/400/300?random=17",
    description: "Set of 2 decorative throw pillows",
    stock: 24,
    rating: 4.1,
  },
  {
    id: "home-004",
    name: "Area Rug",
    category: "home",
    price: 159.99,
    image: "https://picsum.photos/400/300?random=18",
    description: "Elegant area rug (5x7 ft) for living room",
    stock: 5,
    rating: 4.4,
  },
  {
    id: "home-005",
    name: "Plant Pot Set",
    category: "home",
    price: 39.99,
    image: "https://picsum.photos/400/300?random=19",
    description: "Set of 3 ceramic plant pots with drainage",
    stock: 18,
    rating: 4.0,
  },
  {
    id: "home-006",
    name: "Wall Clock",
    category: "home",
    price: 44.99,
    image: "https://picsum.photos/400/300?random=20",
    description: "Modern minimalist wall clock in black",
    stock: 13,
    rating: 4.2,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(
  category: string
): Product[] {
  return products.filter((p) => p.category === category);
}

export function searchProducts(query: string): Product[] {
  const lower = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower)
  );
}
