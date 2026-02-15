'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cartAPI, ordersAPI } from '@/lib/api';
import { setCartItems, removeFromCart, updateCartItem } from '@/store/slices/cartSlice';
import { FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await cartAPI.getCart();
        dispatch(setCartItems(response.data));
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, dispatch, router]);

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await cartAPI.removeFromCart(cartItemId);
      dispatch(removeFromCart(cartItemId));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Error removing item');
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await cartAPI.updateCart(cartItemId, { quantity: newQuantity });
      dispatch(updateCartItem({ id: cartItemId, quantity: newQuantity }));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error updating quantity');
    }
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }

    setCheckingOut(true);
    try {
      const response = await ordersAPI.createOrder({
        shippingAddress,
      });
      toast.success('Order placed successfully!');
      dispatch(setCartItems([]));
      router.push(`/orders/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error placing order');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold text-secondary mb-4">Your Cart</h1>
        <p className="text-gray-500 mb-8">Your cart is empty</p>
        <Link href="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-secondary mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b last:border-b-0">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images[0] || 'https://via.placeholder.com/100'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary mb-2">
                      {item.product.name}
                    </h3>
                    <p className="text-primary font-bold mb-4">
                      ₹{item.product.finalPrice}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="px-4 py-1 border-l border-r border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-2"
                      >
                        <FiTrash2 size={18} />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-secondary">
                      ₹{(item.product.finalPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-secondary mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">₹0</span>
              </div>
            </div>

            <div className="flex justify-between mb-6 text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">₹{total.toFixed(2)}</span>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">
                Shipping Address
              </label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your shipping address"
                className="input-field h-24 resize-none"
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="btn-primary w-full py-3"
            >
              {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <Link href="/products" className="btn-outline w-full py-3 text-center mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}