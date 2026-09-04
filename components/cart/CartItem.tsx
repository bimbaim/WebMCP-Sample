"use client";

import { CartItem as CartItemType } from "@/store/cart";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export function CartItem({ item }: { item: CartItemType }) {
  const cart = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      cart.removeItem(item.productId);
    } else {
      cart.updateQuantity(item.productId, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg border border-gray-200">
      {/* Image */}
      <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 line-clamp-1">
          {item.name}
        </h4>
        <p className="text-emerald-600 font-semibold mt-1">
          {formatPrice(item.price)}
        </p>

        {/* Quantity & Remove */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium text-black">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
          >
            +
          </button>
          <button
            onClick={() => cart.removeItem(item.productId)}
            className="ml-auto text-red-600 text-sm font-medium hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="text-right flex-shrink-0">
        <p className="text-gray-600 text-sm">Total</p>
        <p className="text-lg font-bold text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
