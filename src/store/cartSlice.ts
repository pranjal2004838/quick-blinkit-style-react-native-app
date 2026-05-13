import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Product} from '../data/products';

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// flat ₹15 delivery charge, same as the kotlin version
const DELIVERY_FEE_PAISE = 1500;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const found = state.items.find(i => i.product.id === action.payload.id);
      if (found) {
        found.qty += 1;
      } else {
        state.items.push({product: action.payload, qty: 1});
      }
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.product.id !== action.payload);
    },

    increment(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.product.id === action.payload);
      if (item) {
        item.qty += 1;
      }
    },

    decrement(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.product.id === action.payload);
      if (!item) return;

      if (item.qty > 1) {
        item.qty -= 1;
      } else {
        // qty hit 0, just remove the whole thing
        state.items = state.items.filter(i => i.product.id !== action.payload);
      }
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const {addToCart, removeFromCart, increment, decrement, clearCart} =
  cartSlice.actions;

// --- selectors ---

export const selectCartItems = (state: {cart: CartState}) => state.cart.items;

export const selectCartCount = (state: {cart: CartState}) =>
  state.cart.items.reduce((sum, i) => sum + i.qty, 0);

export const selectItemTotal = (state: {cart: CartState}) =>
  state.cart.items.reduce((s, i) => s + i.product.pricePaise * i.qty, 0);

export const selectDeliveryFee = () => DELIVERY_FEE_PAISE;

export const selectGrandTotal = (state: {cart: CartState}) =>
  selectItemTotal(state) + DELIVERY_FEE_PAISE;

// quick lookup map so HomeScreen doesn't have to .find() for every product card
export function selectCartQtyMap(state: {cart: CartState}): Record<string, number> {
  const map: Record<string, number> = {};
  for (const item of state.cart.items) {
    map[item.product.id] = item.qty;
  }
  return map;
}

export default cartSlice.reducer;
