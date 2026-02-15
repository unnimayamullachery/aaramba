'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { productsAPI, cartAPI } from '@/lib/api';
import { setSelectedProduct } from '@/store/slices/productSlice';
import { addToCart } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { selectedProduct } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsAPI.getById(parseInt(params.id));
        dispatch(setSelectedProduct(response.data));
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, dispatch]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    setAddingToCart(true);
    try {
      const response = await cartAPI.addToCart({
        productId: selectedProduct.id,
        quantity,
      });
      dispatch(addToCart(response.data));
      toast.success('Added to cart!');
      setQuantity(1);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={selectedProduct.images[0] || 'https://via.placeholder.com/500'}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
          </div>
          {selectedProduct.images.length > 1 && (
            <div className="flex gap-4 mt-4">
              {selectedProduct.images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`${selectedProduct.name} ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold text-secondary mb-4">
            {selectedProduct.name}
          </h1>

          <div className="mb-6">
            <p className="text-gray-600 text-lg mb-4">
              {selectedProduct.description}
            </p>
            <p className="text-sm text-gray-500">
              SKU: {selectedProduct.sku}
            </p>
            <p className="text-sm text-gray-500">
              Category: {selectedProduct.category?.name}
            </p>
          </div>

          {/* Pricing */}
          <div className="mb-6 pb-6 border-b">
            <div className="flex items-center gap-4">
              <div>
                {selectedProduct.discount > 0 && (
                  <span className="text-gray-500 line-through text-lg">
                    ₹{selectedProduct.price}
                  </span>
                )}
                <p className="text-4xl font-bold text-primary">
                  ₹{selectedProduct.finalPrice}
                </p>
              </div>
              {selectedProduct.discount > 0 && (
                <span className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-semibold">
                  Save {selectedProduct.discount}%
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {selectedProduct.stock > 0 ? (
              <p className="text-green-600 font-semibold">
                ✓ In Stock ({selectedProduct.stock} available)
              </p>
            ) : (
              <p className="text-red-600 font-semibold">Out of Stock</p>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          {selectedProduct.stock > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <label className="font-semibold text-secondary">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center border-l border-r border-gray-300 py-2"
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(selectedProduct.stock, quantity + 1))
                    }
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn-primary w-full text-lg py-3"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}

          {/* Features */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-secondary mb-4">Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Premium Quality</li>
              <li>✓ Authentic Jewellery</li>
              <li>✓ Secure Packaging</li>
              <li>✓ Easy Returns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}