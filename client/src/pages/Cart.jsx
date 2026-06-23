import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx"; // 👈 Context import kiya

export default function Cart() {
  // Destructure functions from context
  const { cartItems, updateQuantity, removeFromCart } = useCart(); 

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 15;
  const total = cartItems.length > 0 ? subtotal + shipping : 0;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
            <Link to="/products" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-50 flex-shrink-0" />
                  
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-gray-400 uppercase mt-0.5">{item.category}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-2">${item.price}</p>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2.5 py-1 text-gray-500 hover:bg-gray-200 font-bold"
                    >-</button>
                    <span className="px-3 py-1 text-sm font-bold text-gray-800">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2.5 py-1 text-gray-500 hover:bg-gray-200 font-bold"
                    >+</button>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Summary Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Order Summary</h3>
              
              <div className="space-y-3 mt-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Estimate</span>
                  <span className="font-semibold text-gray-900">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-100 pt-3 mt-2">
                  <span>Order Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="w-full block text-center bg-gray-900 hover:bg-gray-800 text-white mt-6 py-3 rounded-xl font-bold tracking-wide shadow-sm">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}