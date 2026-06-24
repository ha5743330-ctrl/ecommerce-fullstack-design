import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAdmin } from "../hooks/useAdmin.js"; 
import toast from 'react-hot-toast';
import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAdmin } = useAdmin(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const docSnap = await getDoc(doc(db, "products", id));
      if (docSnap.exists()) setProduct({ id: docSnap.id, ...docSnap.data() });
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading Details...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-lg border grid md:grid-cols-2 gap-12">
        <img src={product.image} alt={product.name} className="w-full h-96 object-cover rounded-2xl" />
        
        <div className="flex flex-col">
          <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full w-fit text-sm">{product.category}</span>
          <h1 className="text-4xl font-black text-gray-900 mt-3">{product.name}</h1>
          <p className="text-3xl font-bold text-gray-800 mt-4">${product.price}</p>
          <p className="text-gray-600 mt-6 leading-relaxed">
            {product.description || "Premium quality product crafted for excellence. Experience modern design and durability in every detail."}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-16 border p-3 rounded-lg" />
            <button onClick={() => { addToCart({...product, qty}); toast.success("Added!"); }} 
              className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black">Add to Cart</button>
          </div>

          {/* Admin Edit Shortcut */}
          {isAdmin && (
            <button onClick={() => navigate('/admin')} className="mt-6 w-full border-2 border-yellow-500 text-yellow-600 py-3 rounded-xl font-bold hover:bg-yellow-500 hover:text-white">
              Edit Product (Admin Only)
            </button>
          )}
          
          <Link to="/products" className="mt-4 text-center text-gray-400 hover:text-gray-900 underline">Back to Shop</Link>
        </div>
      </div>
    </div>
  );
}