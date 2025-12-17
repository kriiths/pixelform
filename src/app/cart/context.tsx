"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { CartItem } from '@/lib/types';

export type { CartItem };

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, maxStock?: number) => void;
  removeItem: (id: string | number, category: string) => void;
  updateQuantity: (id: string | number, category: string, quantity: number, maxStock?: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, 'quantity'>, maxStock?: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.category === item.category
      );

      if (existingItem) {
        // Check stock limit if provided
        if (maxStock !== undefined && existingItem.quantity >= maxStock) {
          return prevItems; // Don't add more if at max stock
        }
        // Increment quantity for existing item
        return prevItems.map((i) =>
          i.id === item.id && i.category === item.category
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      // Add new item with quantity 1 if stock allows
      if (maxStock !== undefined && maxStock <= 0) {
        return prevItems; // Don't add if out of stock
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string | number, category: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.category === category))
    );
  };

  const updateQuantity = (id: string | number, category: string, quantity: number, maxStock?: number) => {
    if (quantity <= 0) {
      removeItem(id, category);
      return;
    }

    // Check stock limit if provided
    const finalQuantity = maxStock !== undefined ? Math.min(quantity, maxStock) : quantity;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.category === category
          ? { ...item, quantity: finalQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ''), 10);
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
