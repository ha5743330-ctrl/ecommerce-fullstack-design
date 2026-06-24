import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-white">
      
      {/* 1. HERO SECTION (Larger & Cleaner) */}
      <div className="relative h-[80vh] flex items-center bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
            Designed for <br/> <span className="text-gray-400">The Modern Era.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-md">Premium quality products curated for your daily lifestyle. Minimalist, durable, and timeless.</p>
          <div className="mt-8 flex gap-4">
            <Link to="/products" className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition">Shop Now</Link>
            <Link to="/products" className="border border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition">Explore All</Link>
          </div>
        </div>
      </div>

      {/* 2. FEATURED CATEGORIES (Visual Cards) */}
      <div className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-black text-gray-900 mb-10">Shop by Category</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {["Electronics", "Footwear", "Accessories"].map((cat) => (
            <Link to={`/products?category=${cat}`} key={cat} className="group relative h-64 rounded-3xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600" className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{cat}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. TRUST & FEATURES (Simplified Grid) */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="font-bold text-xl">Global Shipping</h3>
            <p className="text-gray-500 mt-2">We deliver to over 100+ countries worldwide.</p>
          </div>
          <div>
            <h3 className="font-bold text-xl">Secure Payments</h3>
            <p className="text-gray-500 mt-2">Your data is protected by industry standard encryption.</p>
          </div>
          <div>
            <h3 className="font-bold text-xl">24/7 Support</h3>
            <p className="text-gray-500 mt-2">Our dedicated team is always ready to assist you.</p>
          </div>
        </div>
      </div>

    </div>
  );
}