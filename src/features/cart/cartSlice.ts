import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "@/types";
import { MAX_CART_QTY } from "@/constants";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

function findItemIndex(
  items: CartItem[],
  productId: string,
  color: string,
  size: string
): number {
  return items.findIndex(
    (i) => i.productId === productId && i.color === color && i.size === size
  );
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const idx = findItemIndex(
        state.items,
        action.payload.productId,
        action.payload.color,
        action.payload.size
      );
      if (idx !== -1) {
        const existing = state.items[idx];
        if (existing) {
          existing.qty = Math.min(existing.qty + action.payload.qty, MAX_CART_QTY, existing.stock);
        }
      } else {
        state.items.push({
          ...action.payload,
          qty: Math.min(action.payload.qty, MAX_CART_QTY, action.payload.stock),
        });
      }
    },
    removeItem(
      state,
      action: PayloadAction<{ productId: string; color: string; size: string }>
    ) {
      const idx = findItemIndex(
        state.items,
        action.payload.productId,
        action.payload.color,
        action.payload.size
      );
      if (idx !== -1) state.items.splice(idx, 1);
    },
    incrementQty(
      state,
      action: PayloadAction<{ productId: string; color: string; size: string }>
    ) {
      const idx = findItemIndex(
        state.items,
        action.payload.productId,
        action.payload.color,
        action.payload.size
      );
      const item = state.items[idx];
      if (item) {
        item.qty = Math.min(item.qty + 1, MAX_CART_QTY, item.stock);
      }
    },
    decrementQty(
      state,
      action: PayloadAction<{ productId: string; color: string; size: string }>
    ) {
      const idx = findItemIndex(
        state.items,
        action.payload.productId,
        action.payload.color,
        action.payload.size
      );
      const item = state.items[idx];
      if (item) {
        if (item.qty <= 1) {
          state.items.splice(idx, 1);
        } else {
          item.qty -= 1;
        }
      }
    },
    setQty(
      state,
      action: PayloadAction<{ productId: string; color: string; size: string; qty: number }>
    ) {
      const idx = findItemIndex(
        state.items,
        action.payload.productId,
        action.payload.color,
        action.payload.size
      );
      const item = state.items[idx];
      if (item) {
        const clamped = Math.min(
          Math.max(action.payload.qty, 1),
          MAX_CART_QTY,
          item.stock
        );
        if (clamped <= 0) {
          state.items.splice(idx, 1);
        } else {
          item.qty = clamped;
        }
      }
    },
    clearCart(state) {
      state.items = [];
    },
    mergeGuestCart(state, action: PayloadAction<CartItem[]>) {
      action.payload.forEach((guestItem) => {
        const idx = findItemIndex(state.items, guestItem.productId, guestItem.color, guestItem.size);
        if (idx !== -1) {
          const existing = state.items[idx];
          if (existing) {
            existing.qty = Math.min(existing.qty + guestItem.qty, MAX_CART_QTY, existing.stock);
          }
        } else {
          state.items.push(guestItem);
        }
      });
    },
  },
});

export const {
  addItem,
  removeItem,
  incrementQty,
  decrementQty,
  setQty,
  clearCart,
  mergeGuestCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, i) => sum + i.qty, 0);
export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
