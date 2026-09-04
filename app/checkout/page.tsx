"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  const items = useCart((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-gray-600 text-lg mb-8">Your cart is empty</p>
          <Link
            href="/products"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        {/* Form */}
        <CheckoutForm />

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/cart"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
