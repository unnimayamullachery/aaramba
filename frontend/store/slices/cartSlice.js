import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.total = action.payload.reduce(
        (sum, item) => sum + item.product.finalPrice * item.quantity,
        0
      );
    },
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.total = state.items.reduce(
        (sum, item) => sum + item.product.finalPrice * item.quantity,
        0
      );
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = state.items.reduce(
        (sum, item) => sum + item.product.finalPrice * item.quantity,
        0
      );
    },
    updateCartItem: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.total = state.items.reduce(
        (sum, item) => sum + item.product.finalPrice * item.quantity,
        0
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
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
  setCartItems,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;
export default cartSlice.reducer;