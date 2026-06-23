import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import toast from 'react-hot-toast';
import { db } from "../firebase.js"; // Firebase import
import { doc, getDoc } from "firebase/firestore"; // Firestore functions

export default function ProductDetails() {
  const { id } = useParams(); // URL se ID mil gayi
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id); // 'products' collection se specific ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Product nahi mila!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-20 text-center text-xl">Loading...</div>;

  if (!product) {
    return (
      <div className="p-10 text-center text-xl">
        Product nahi mila!
        <Link to="/" className="block text-blue-500 underline mt-4">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 grid md:grid-cols-2 gap-8">
        <img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded-xl" />
        
        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold text-gray-400 uppercase">{product.category}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
          <p className="text-2xl font-extrabold text-gray-900 mt-4">${product.price}</p>
          
          <button 
            onClick={() => {
              addToCart(product);
              toast.success(`${product.name} added to cart!`);
            }}
            className="mt-6 bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Add to Cart
          </button>
          
          <Link to="/" className="mt-4 text-gray-500 hover:text-gray-900 underline text-center">
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}