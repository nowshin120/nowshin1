import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext();
const CART_STORAGE_KEY = 'nowshin-fashion-house-cart';

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeCartItem(product, quantity = 1) {
  return {
    id: product.id ?? `${product.name}-${product.category_slug ?? 'item'}`,
    name: product.name ?? 'Untitled product',
    image_url: product.image_url || product.image || '',
    price: toNumber(product.price),
    delivery_charge: toNumber(product.delivery_charge ?? product.deliveryCharge),
    category_slug: product.category_slug ?? '',
    quantity: Math.max(1, toNumber(quantity) || 1),
  };
}

export function summarizeCartItems(items) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryTotal = items.length
    ? Math.max(...items.map((item) => toNumber(item.delivery_charge)))
    : 0;

  return {
    totalItems,
    subtotal,
    deliveryTotal,
    grandTotal: subtotal + deliveryTotal,
  };
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutState, setCheckoutState] = useState({
    isOpen: false,
    items: [],
    mode: 'cart',
  });

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!storedValue) return;

      const parsed = JSON.parse(storedValue);
      if (!Array.isArray(parsed)) return;

      setCartItems(parsed.map((item) => normalizeCartItem(item, item.quantity)));
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartSummary = useMemo(() => summarizeCartItems(cartItems), [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product, quantity = 1) => {
    const normalizedItem = normalizeCartItem(product, quantity);

    setCartItems((current) => {
      const existingItem = current.find((item) => item.id === normalizedItem.id);
      if (!existingItem) {
        return [...current, normalizedItem];
      }

      return current.map((item) =>
        item.id === normalizedItem.id
          ? { ...item, quantity: item.quantity + normalizedItem.quantity }
          : item
      );
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCartItems((current) => current.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, nextQuantity) => {
    const safeQuantity = Math.max(1, toNumber(nextQuantity) || 1);

    setCartItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, quantity: safeQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openCheckoutWithItems = (items, mode) => {
    setCheckoutState({
      isOpen: true,
      items: items.map((item) => normalizeCartItem(item, item.quantity)),
      mode,
    });
  };

  const closeCheckout = () => {
    setCheckoutState((current) => ({ ...current, isOpen: false }));
  };

  const buyNow = (product) => {
    closeCart();
    openCheckoutWithItems([product], 'buy-now');
  };

  const checkoutCart = () => {
    if (!cartItems.length) return;
    closeCart();
    openCheckoutWithItems(cartItems, 'cart');
  };

  const completeCheckout = () => {
    if (checkoutState.mode === 'cart') {
      clearCart();
    }

    setCheckoutState({
      isOpen: false,
      items: [],
      mode: 'cart',
    });
  };

  const value = {
    cartItems,
    cartSummary,
    itemCount,
    isCartOpen,
    checkoutState,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    buyNow,
    checkoutCart,
    closeCheckout,
    completeCheckout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
