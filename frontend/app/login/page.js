'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { setUser } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      dispatch(setUser({ token, user }));

      toast.success('Login successful!');
      router.push('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-secondary mb-8 text-center">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Register here
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-secondary mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-600">
              <strong>Admin:</strong> admin@aaramba.com / admin123
            </p>
            <p className="text-xs text-gray-600">
              <strong>Customer:</strong> customer@aaramba.com / customer123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}