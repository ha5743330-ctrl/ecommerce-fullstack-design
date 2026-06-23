import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. HERO SECTION */}
      <div className="relative bg-gray-900 overflow-hidden">
        {/* Background Decorative Image Overlay */}
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <span className="text-xs font-semibold tracking-widest text-gray-300 uppercase bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm mb-4">
            New Arrivals 2026
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-3xl leading-tight">
            Elevate Your Everyday <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 underline decoration-gray-500">Lifestyle</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-xl leading-relaxed">
            Discover our curated collection of premium footwear, minimalist accessories, and high-performance electronics. Designed for modern living.
          </p>
          <div className="mt-10">
            <Link 
              to="/products" 
              className="inline-block bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-base shadow-lg hover:bg-gray-100 transform hover:-translate-y-0.5 transition-all duration-200 tracking-wide"
            >
              Shop Collection Now →
            </Link>
          </div>
        </div>
      </div>

      {/* 2. FEATURES / TRUST BADGES SECTION */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 bg-gray-50 rounded-2xl text-gray-900 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M8.25 4.5h8.25a1.5 1.5 0 0 1 1.5 1.5v3m-11.25-3a1.5 1.5 0 0 0-1.5 1.5v3M10.5 2.25H13.5M9 14.25h6.75M16.5 9.75l-2.25 2.25m0 0l-2.25-2.25m2.25 2.25V5.25" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Fast & Free Shipping</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">Enjoy complimentary express delivery on all orders nationwide over $50.</p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 bg-gray-50 rounded-2xl text-gray-900 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Premium Quality</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">Every product is crafted with precision and authentic materials to last a lifetime.</p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 bg-gray-50 rounded-2xl text-gray-900 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Easy Returns</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">Not satisfied? No worries! Return or exchange any product within 30 days, hassle-free.</p>
          </div>

        </div>
      </div>

    </div>
  );
}