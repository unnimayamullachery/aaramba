import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  categories: [],
  selectedProduct: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.products;
      state.pagination = action.payload.pagination;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  setCategories,
  setSelectedProduct,
  setLoading,
  setError,
} = productSlice.actions;
export default productSlice.reducer;