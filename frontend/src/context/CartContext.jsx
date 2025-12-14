import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [count, setCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadCart();
    loadCount();
  }, []);

  const loadCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.data.items || []);
    } catch {
      setCart([]);
    }
  };

  const loadCount = async () => {
    try {
      const res = await api.get("/cart/count");
      setCount(res.data.data.count);
    } catch {
      setCount(0);
    }
  };

  const addItem = async (sweetId, quantity = 1) => {
    await api.post("/cart/items", { sweetId, quantity });
    loadCart();
    loadCount();
    setRefreshTrigger((prev) => prev + 1);
  };

  const updateItem = async (itemId, quantity) => {
    await api.put(`/cart/items/${itemId}`, { quantity });
    loadCart();
    loadCount();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/items/${itemId}`);
    loadCart();
    loadCount();
  };

  const clearCart = async () => {
    await api.delete("/cart");
    setCart([]);
    setCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        count,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        loadCart,
        loadCount,
        refreshTrigger,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
