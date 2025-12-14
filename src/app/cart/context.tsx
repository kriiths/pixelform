"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { CartItem } from '@/lib/types';
import { products } from '@/app/shop/data/index';

export type { CartItem };

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number, category: string) => void;
  updateQuantity: (id: number, category: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.category === item.category
      );

      // Find the product in the products data to get stock
      const productList = products[item.category as keyof typeof products];
      const product = productList?.find((p) => p.id === item.id);
      const stock = product?.stock ?? 0;

      if (existingItem) {
        if (existingItem.quantity >= stock) {
          // Do not add more than stock
          return prevItems;
        }
        return prevItems.map((i) =>
          i.id === item.id && i.category === item.category
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      if (stock > 0) {
        return [...prevItems, { ...item, quantity: 1 }];
      }
      // If out of stock, do not add
      return prevItems;
    });
  };

  const removeItem = (id: number, category: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.category === category))
    );
  };

  const updateQuantity = (id: number, category: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, category);
      return;
    }

    // Find the product in the products data to get stock
    const productList = products[category as keyof typeof products];
    const product = productList?.find((p) => p.id === id);
    const stock = product?.stock ?? 0;
    const safeQuantity = Math.min(quantity, stock);

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.category === category
          ? { ...item, quantity: safeQuantity }
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
