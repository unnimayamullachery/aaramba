'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { ordersAPI } from '@/lib/api';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getOrders();
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold text-secondary mb-4">My Orders</h1>
        <p className="text-gray-500 mb-8">You haven't placed any orders yet</p>
        <Link href="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-secondary mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`}>
            <div className="card p-6 cursor-pointer hover:shadow-lg transition">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-secondary">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold text-secondary">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-semibold text-primary">₹{order.totalAmount}</p>
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
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Items:</p>
                <div className="flex flex-wrap gap-2">
                  {order.orderItems.map((item) => (
                    <span
                      key={item.id}
                      className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-700"
                    >
                      {item.product.name} x{item.quantity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}