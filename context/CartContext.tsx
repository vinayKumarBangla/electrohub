'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductWithDetails, ProductVariant } from '@/lib/actions/products';
import { useRouter } from 'next/navigation';

export interface CartItem {
  cartItemId: string;
  productId: string;
  variantId: string;
  title: string;
  brandName: string;
  sellingPrice: number;
  mrpPrice: number;
  quantity: number;
  maxStock: number;
  image: string;
  variantLabel?: string;
  variantAttributes?: Record<string, any>;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ProductWithDetails, variant?: ProductVariant) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalItems: number;
  cartTotal: number;
  totalMrp: number;
  totalSellingPrice: number;
  totalDiscount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem('electrohub_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Failed to load cart:', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('electrohub_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: ProductWithDetails, variantParam?: ProductVariant) => {
    // AUTHENTICATION CHECK: If not logged in, redirect to login/registration page
    const user = localStorage.getItem('electrohub_user');
    if (!user) {
      router.push('/login');
      return;
    }

    const selectedVariant = (variantParam || product.product_variants?.[0] || {}) as Record<string, any>;
    const productAny = product as Record<string, any>;

    const variantId = selectedVariant.id || 'default';
    const cartItemId = `${product.id}-${variantId}`;

    // Robust image resolution covering all possible database schema field variations
    const rawImg = 
      selectedVariant.images?.[0] || 
      selectedVariant.image_url || 
      selectedVariant.image || 
      productAny.image_url || 
      productAny.image || 
      productAny.img || 
      (Array.isArray(productAny.images) ? productAny.images[0] : null);

    let resolvedImage = '/assets/products/mobiles.png';
    if (rawImg && typeof rawImg === 'string' && rawImg.trim() !== '') {
      resolvedImage = rawImg;
    }

    const sellingPrice = Number(selectedVariant.selling_price || selectedVariant.price || productAny.price || 499);
    const mrpPrice = Number(selectedVariant.mrp_price || productAny.mrp_price || Math.round(sellingPrice * 1.3));
    const maxStock = Number(selectedVariant.stock_quantity || 10);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity = Math.min(updated[existingIndex].quantity + 1, maxStock);
        return updated;
      }

      return [
        ...prevCart,
        {
          cartItemId,
          productId: product.id,
          variantId,
          title: product.title || productAny.name,
          brandName: productAny.brands?.name || productAny.brand || 'ElectroHub',
          sellingPrice,
          mrpPrice,
          quantity: 1,
          maxStock,
          image: resolvedImage,
          variantLabel: selectedVariant.color || selectedVariant.storage || 'Standard',
          variantAttributes: selectedVariant.attributes || {},
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: Math.min(newQty, item.maxStock || 10) } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalMrp = cart.reduce((total, item) => total + item.mrpPrice * item.quantity, 0);
  const totalSellingPrice = cart.reduce((total, item) => total + item.sellingPrice * item.quantity, 0);
  const totalDiscount = totalMrp - totalSellingPrice;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount: totalItems,
        totalItems,
        cartTotal: totalSellingPrice,
        totalMrp,
        totalSellingPrice,
        totalDiscount,
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