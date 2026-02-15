'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { ordersAPI } from '@/lib/api';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await ordersAPI.getOrderById(parseInt(params.id));
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  const statusSteps = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="container py-12">
      <Link href="/orders" className="text-primary hover:underline mb-6 inline-block">
        ← Back to Orders
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <h1 className="text-3xl font-bold text-secondary mb-6">
              Order #{order.id}
            </h1>

            {/* Status Timeline */}
            <div className="mb-8">
              <h3 className="font-semibold text-secondary mb-4">Order Status</h3>
              <div className="flex items-center justify-between">
                {statusSteps.map((step, index) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${
                        index <= currentStepIndex
                          ? 'bg-primary text-secondary'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <p className="text-sm text-center">{step}</p>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 mt-2 ${
                          index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-secondary mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0] || 'https://via.placeholder.com/100'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-secondary mb-1">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-primary font-semibold">
                        ₹{item.priceAtPurchase} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-secondary">
                        ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-secondary mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold text-secondary">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p
                  className={`font-semibold ${
                    order.status === 'Delivered'
                      ? 'text-green-600'
                      : order.status === 'Cancelled'
                      ? 'text-red-600'
                      : 'text-blue-600'
                  }`}
                >
                  {order.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className="font-semibold text-secondary">{order.paymentStatus}</p>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b">
              <p className="text-sm text-gray-600 mb-2">Shipping Address</p>
              <p className="text-secondary">{order.shippingAddress}</p>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{order.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span className="text-primary">₹{order.totalAmount}</span>
            </div>

            <Link href="/products" className="btn-primary w-full text-center py-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}