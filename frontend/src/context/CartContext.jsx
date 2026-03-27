import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('vinoteca_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('vinoteca_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (vino, cantidad = 1) => {
    setCart(prev => {
      const exists = prev.find(item => item.vino._id === vino._id);
      if (exists) {
        return prev.map(item => 
          item.vino._id === vino._id 
            ? { ...item, cantidad: item.cantidad + cantidad } 
            : item
        );
      }
      return [...prev, { vino, cantidad }];
    });
  };

  const removeFromCart = (vinoId) => {
    setCart(prev => prev.filter(item => item.vino._id !== vinoId));
  };

  const updateQuantity = (vinoId, cantidad) => {
    setCart(prev => prev.map(item => 
      item.vino._id === vinoId 
        ? { ...item, cantidad } 
        : item
    ));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.vino.precio * item.cantidad), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
