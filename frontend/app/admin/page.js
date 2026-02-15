'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { ordersAPI, productsAPI } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const ordersResponse = await ordersAPI.getAllOrders({ limit: 5 });
        const productsResponse = await productsAPI.getAll({ limit: 1 });

        setRecentOrders(ordersResponse.data.orders);
        setStats({
          totalOrders: ordersResponse.data.pagination.total,
          totalProducts: productsResponse.data.pagination.total,
          totalRevenue: ordersResponse.data.orders.reduce(
            (sum, order) => sum + order.totalAmount,
            0
          ),
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-secondary mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card p-6">
          <p className="text-gray-600 text-sm mb-2">Total Orders</p>
          <p className="text-4xl font-bold text-primary">{stats.totalOrders}</p>
        </div>
        <div className="card p-6">
          <p className="text-gray-600 text-sm mb-2">Total Products</p>
          <p className="text-4xl font-bold text-primary">{stats.totalProducts}</p>
        </div>
        <div className="card p-6">
          <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
          <p className="text-4xl font-bold text-primary">₹{stats.totalRevenue}</p>
        </div>
      </div>

      {/* Management Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link href="/admin/products">
          <div className="card p-6 cursor-pointer hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-secondary mb-2">Manage Products</h3>
            <p className="text-gray-600">Add, edit, or delete products</p>
          </div>
        </Link>
        <Link href="/admin/categories">
          <div className="card p-6 cursor-pointer hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-secondary mb-2">Manage Categories</h3>
            <p className="text-gray-600">Add, edit, or delete categories</p>
          </div>
        </Link>
        <Link href="/admin/orders">
          <div className="card p-6 cursor-pointer hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-secondary mb-2">Manage Orders</h3>
            <p className="text-gray-600">View and update order status</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-secondary mb-6">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-secondary">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#{order.id}</td>
                    <td className="py-3 px-4">{order.user.name}</td>
                    <td className="py-3 px-4 text-primary font-semibold">
                      ₹{order.totalAmount}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded text-sm font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}