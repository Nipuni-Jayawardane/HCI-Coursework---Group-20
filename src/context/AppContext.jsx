import { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts } from "../data/products";

// Create the context
export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export function AppProvider({ children }) {
  // Auth State
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Shopping Cart State
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    // Initialize favorites from localStorage if available
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Orders State
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Product View State
  const [activeProduct, setActiveProduct] = useState(null);
  const [viewMode, setViewMode] = useState("2d"); // '2d' or '3d'

  // Product State
  const [products, setProducts] = useState(initialProducts);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Cart Functions
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      )
    );
  };

  // Order Functions
  const placeOrder = () => {
    if (cart.length === 0 || !user) return false;

    const newOrder = {
      id: Date.now().toString(),
      userId: user.id,
      userEmail: user.email,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.images[0],
      })),
      total: cartTotal,
      status: "Pending",
      date: new Date().toISOString(),
    };

    setOrders((prev) => [...prev, newOrder]);
    setCart([]); // Clear cart after order is placed
    return true;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Get user's orders
  const getUserOrders = () => {
    if (!user) return [];
    return orders.filter((order) => order.userId === user.id);
  };

  // Get all orders (for admin)
  const getAllOrders = () => {
    if (!isAdmin) return [];
    return orders;
  };

  // Favorites Functions
  const addToFavorites = (product) => {
    setFavorites((prev) => {
      if (!prev.some((fav) => fav.id === product.id)) {
        const newFavorites = [...prev, product];
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        return newFavorites;
      }
      return prev;
    });
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((product) => product.id !== productId);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // Auth Functions
  const login = (credentials) => {
    if (
      credentials.email === "admin@example.com" &&
      credentials.password === "admin"
    ) {
      const adminUser = {
        id: "admin",
        name: "Admin User",
        email: credentials.email,
      };
      setUser(adminUser);
      setIsAdmin(true);
      return true;
    } else if (
      credentials.email === "user@example.com" &&
      credentials.password === "user"
    ) {
      const regularUser = {
        id: "user",
        name: "Regular User",
        email: credentials.email,
      };
      setUser(regularUser);
      setIsAdmin(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setCart([]);
  };

  // Add register function to handle new user sign up
  const register = (credentials) => {
    const newUser = {
      id: Date.now().toString(),
      name: credentials.name,
      email: credentials.email,
    };
    setUser(newUser);
    setIsAdmin(false);
    return true;
  };

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Context value
  const contextValue = {
    user,
    isAdmin,
    cart,
    cartTotal,
    favorites,
    activeProduct,
    viewMode,
    orders,
    login,
    logout,
    register,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addToFavorites,
    removeFromFavorites,
    setActiveProduct,
    setViewMode,
    products,
    setProducts,
    placeOrder,
    updateOrderStatus,
    getUserOrders,
    getAllOrders,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
