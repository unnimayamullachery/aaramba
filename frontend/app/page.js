'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { productsAPI } from '@/lib/api';
import { setProducts } from '@/store/slices/productSlice';
import Image from 'next/image';

export default function Home() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productsAPI.getAll({ featured: 'true', limit: 6 });
        dispatch(setProducts(response.data));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [dispatch]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="container py-20 text-center">
        <h1 className="text-5xl font-bold text-secondary mb-4">
          Welcome to <span className="text-primary">Aaramba</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover premium jewellery for every occasion
        </p>
        <Link href="/products" className="btn-primary text-lg">
          Shop Now
        </Link>
      </section>

      {/* Featured Products */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-secondary mb-12 text-center">
          Featured Products
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="card p-4 cursor-pointer">
                  <div className="relative w-full h-64 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      {product.discount > 0 && (
                        <span className="text-gray-500 line-through text-sm">
                          ₹{product.price}
                        </span>
                      )}
                      <p className="text-primary font-bold text-lg">
                        ₹{product.finalPrice}
                      </p>
                    </div>
                    {product.discount > 0 && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-white py-16 mt-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Exclusive Collection</h2>
          <p className="text-lg mb-8">
            Browse our complete collection of premium jewellery
          </p>
          <Link href="/products" className="btn-primary">
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}