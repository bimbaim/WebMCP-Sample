import { NextRequest, NextResponse } from "next/server";

// In-memory order storage
const completedOrders = new Map<
  string,
  {
    id: string;
    customerName: string;
    customerEmail: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    status: string;
    createdAt: string;
  }
>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { customerName, customerEmail, items, total } = body;

    if (!customerName || !customerEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)
      .toUpperCase()}`;

    // Save order
    completedOrders.set(orderId, {
      id: orderId,
      customerName,
      customerEmail,
      items,
      total,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        orderId,
        status: "confirmed",
        message: "Order placed successfully",
        total,
        itemCount: items.length,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("id");

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID required" },
      { status: 400 }
    );
  }

  const order = completedOrders.get(orderId);
  if (!order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(order, { status: 200 });
}
