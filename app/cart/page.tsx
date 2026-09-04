"use client";

import Link from "next/link";
import { useCart, CartItem as CartItemType } from "@/store/cart";
import { CartItem } from "@/components/cart/CartItem";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, getTotal } = useCart();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: CartItemType) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
            <h2 className="font-semibold text-lg text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-900">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between mb-6 text-lg">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-emerald-600">
                {formatPrice(total)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-emerald-700 transition-colors mb-4"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="block w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
