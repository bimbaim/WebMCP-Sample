"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, CartItem as CartItemType } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export function CheckoutForm() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = getTotal();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.customerName || !formData.customerEmail) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          items,
          total,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        clearCart();
        router.push(`/checkout/success?order=${result.orderId}`);
      } else {
        setError(result.error || "Checkout failed");
      }
    } catch (err) {
      setError("Failed to process checkout. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Your cart is empty</p>
        <p className="text-gray-500 mt-2">Add items before checkout</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      toolname="checkout"
      tooldescription="Lakukan checkout dan buat pesanan baru dengan informasi pelanggan">

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Customer Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              placeholder="John Doe"
              toolparamdescription="Nama lengkap pelanggan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              placeholder="john@example.com"
              toolparamdescription="Email untuk konfirmasi pesanan"
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Shipping Address</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
              placeholder="123 Main St"
              toolparamdescription="Alamat pengiriman"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="New York"
                toolparamdescription="Kota tujuan pengiriman"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                placeholder="10001"
                toolparamdescription="Kode pos pengiriman"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {items.map((item: CartItemType) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.name} x {item.quantity}
              </span>
              <span className="font-medium text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-emerald-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}
