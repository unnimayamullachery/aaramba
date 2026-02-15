'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { FiShoppingCart, FiLogOut, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
  };

  return (
    <nav className="bg-secondary text-white sticky top-0 z-50 shadow-lg">
      <div className="container flex justify-between items-center py-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          Aaramba
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <Link href="/products" className="hover:text-primary transition">
            Products
          </Link>
          {isAuthenticated && user?.role === 'admin' && (
            <Link href="/admin" className="hover:text-primary transition">
              Admin
            </Link>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <Link href="/cart" className="relative hover:text-primary transition">
            <FiShoppingCart size={24} />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-secondary text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex gap-4 items-center">
              <span className="text-sm">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-primary transition"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="btn-outline text-xs">
                Login
              </Link>
              <Link href="/register" className="btn-primary text-xs">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}