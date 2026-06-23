import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx"; 
import toast from 'react-hot-toast'; 
import { db } from "../firebase.js"; 
import { collection, getDocs } from "firebase/firestore";

const CATEGORIES = ["All", "Footwear", "Accessories", "Electronics", "Travel"];

export default function ProductListing() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, searchQuery } = useCart(); 
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(data);
      } catch (error) {
        console.error("Error: ", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    setSelectedCategory(categoryParam || "All");
  }, [location.search]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added!`);
  };

  if (loading) return <div className="text-center py-20 font-bold text-gray-600">Loading Products...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {selectedCategory === "All" ? "Trending Products" : selectedCategory}
          </h1>
          <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                  selectedCategory === cat ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col overflow-hidden group">
                {/* Image Link */}
                <Link to={`/products/${product.id}`} className="overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </Link>
                
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</span>
                  {/* Name Link */}
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-md font-bold text-gray-800 mt-1 mb-4 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    <button 
                      onClick={() => handleAddToCart(product)} 
                      className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}