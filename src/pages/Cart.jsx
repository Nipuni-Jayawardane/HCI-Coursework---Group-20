import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export default function Cart() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    user,
    isAdmin,
    placeOrder,
  } = useAppContext();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);

    setTimeout(() => {
      if (!user) {
        setIsCheckingOut(false);
        navigate("/login");
        return;
      }

      const success = placeOrder();
      setIsCheckingOut(false);

      if (success) {
        navigate(isAdmin ? "/admin" : "/dashboard");
      }
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-primary-400" />
          <h2 className="mt-4 text-lg font-display font-medium text-primary-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-primary-500">
            Start shopping to add items to your cart
          </p>
          <Link to="/" className="mt-6 inline-block btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <h1 className="text-3xl font-display font-bold text-primary-900 mb-8">
          Shopping Cart
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cart.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <img
                src={item.images[0]}
                alt={item.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex flex-col space-y-2">
                <Link
                  to={`/product/${item.id}`}
                  className="text-lg font-medium text-primary-900 hover:text-accent-600"
                >
                  {item.name}
                </Link>
                <p className="text-primary-500">${item.price.toFixed(2)}</p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <MinusIcon className="h-5 w-5 text-primary-500" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <PlusIcon className="h-5 w-5 text-primary-500" />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium text-primary-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-primary-400 hover:text-primary-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-primary-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="ml-2">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="ml-2">Free</span>
            </div>
            <div className="flex justify-between font-medium text-primary-900">
              <span>Total:</span>
              <span className="ml-2">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="mt-4 sm:mt-0 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingOut ? (
              <div className="flex items-center justify-center">
                <div className="spinner mr-2" />
                Processing...
              </div>
            ) : (
              "Proceed to Checkout"
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
