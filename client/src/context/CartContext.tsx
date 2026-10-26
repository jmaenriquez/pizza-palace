import React from "react";
import { useAuth } from "./AuthContext";
import api from "../api/requests/cartRequest";

interface CartContextValue {
  cartCount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [cartCount, setCartCount] = React.useState(0);

  const refreshCart = React.useCallback(async () => {
    if (!session) {
      setCartCount(0);
      return;
    }

    try {
      const data = await api.getCartItems();
      setCartCount(data.length);
    } catch (err) {
      console.error(err);
    }
  }, [session]);

  // load on login / logout
  React.useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}