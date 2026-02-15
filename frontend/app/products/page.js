'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { setProducts, setCategories } from '@/store/slices/productSlice';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, categories, pagination } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    page: 1,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        dispatch(setCategories(response.data));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          ...filters,
          limit: 12,
        };
        const response = await productsAPI.getAll(params);
        dispatch(setProducts(response.data));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-secondary mb-8">Our Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary mb-4">Filters</h3>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className="input-field"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">
                Category
              </label>
              <select
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">
                Min Price
              </label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min price"
                className="input-field"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">
                Max Price
              </label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max price"
                className="input-field"
              />
            </div>

            <button
              onClick={() =>
                setFilters({
                  categoryId: '',
                  minPrice: '',
                  maxPrice: '',
                  search: '',
                  page: 1,
                })
              }
              className="btn-secondary w-full"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="card p-4 cursor-pointer h-full">
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

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, page }))
                        }
                        className={`px-4 py-2 rounded ${
                          filters.page === page
                            ? 'btn-primary'
                            : 'btn-outline'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}