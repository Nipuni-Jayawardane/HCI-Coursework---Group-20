import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { cart, favorites, user, logout, isAdmin } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Close the user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Living Room", href: "/category/living-room" },
    { name: "Dining Room", href: "/category/dining-room" },
    { name: "Bedroom", href: "/category/bedroom" },
    { name: "3D Room", href: "/room-designer" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        {/*
          1) TOP INFO BAR
        */}
        <div className="hidden sm:block bg-white border-b">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between text-xs text-primary-500 py-2">
              <div className="flex space-x-4">
                <span>HOT LINE +94 115400400</span>
                <Link to="/service-centres" className="hover:underline">
                  SERVICE CENTRES
                </Link>
                <Link to="/store-locator" className="hover:underline">
                  STORE LOCATOR
                </Link>
                <Link to="/careers" className="hover:underline">
                  CAREERS
                </Link>
              </div>
              <div>
                <select className="text-sm bg-transparent focus:outline-none">
                  <option>LKR</option>
                  <option>USD</option>
                </select>
              </div>
            </div>
          </nav>
        </div>

        {/*
          2) MIDDLE LOGO + SEARCH + ACTIONS
        */}
        <div className="bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/" className="font-display text-2xl text-primary-900">
                  FurnitureHouse.com
                </Link>
              </div>

              {/* Search (centered) */}
              <div className="hidden sm:flex flex-1 justify-center px-4">
                <Link to="/search" className="w-full max-w-md">
                  <div className="relative text-primary-500 hover:text-primary-700">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none"
                    />
                  </div>
                </Link>
              </div>

              {/* Icons */}
              <div className="hidden sm:flex sm:items-center sm:space-x-6">
                <Link
                  to="/favorites"
                  className="text-primary-500 hover:text-primary-700 relative"
                >
                  <HeartIcon className="h-6 w-6" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {favorites.length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/cart"
                  className="text-primary-500 hover:text-primary-700 relative"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cart.length}
                    </span>
                  )}
                </Link>
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="text-primary-500 hover:text-primary-700 focus:outline-none"
                  >
                    <UserIcon className="h-6 w-6" />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                      {user ? (
                        <>
                          <div className="px-4 py-2 text-sm text-gray-700 border-b">
                            {user.name}
                          </div>
                          <Link
                            to={isAdmin ? "/admin" : "/dashboard"}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {isAdmin ? "Admin Dashboard" : "Dashboard"}
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Login
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="sm:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-primary-500 hover:text-primary-700"
                >
                  {isMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
              <div className="sm:hidden py-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-3 py-2 text-base font-medium text-primary-500 hover:text-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="mt-2 pt-2 border-t border-primary-200 flex items-center justify-around px-4">
                  <Link
                    to="/favorites"
                    className="text-primary-500 hover:text-primary-700 relative"
                  >
                    <HeartIcon className="h-6 w-6" />
                    {favorites.length > 0 && (
                      <span className="absolute -top-1 -right-2 bg-accent-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/cart"
                    className="text-primary-500 hover:text-primary-700 relative"
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-2 bg-accent-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  {user ? (
                    <Link
                      to={isAdmin ? "/admin" : "/dashboard"}
                      className="text-primary-500 hover:text-primary-700 flex items-center"
                    >
                      <UserIcon className="h-6 w-6" />
                      <span className="ml-1 text-base font-medium">
                        {isAdmin ? "Admin" : "Dashboard"}
                      </span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="text-primary-500 hover:text-primary-700 flex items-center"
                    >
                      <UserIcon className="h-6 w-6" />
                      <span className="ml-1 text-base font-medium">Login</span>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </nav>
        </div>

        {/*
          3) BOTTOM CATEGORIES BAR
        */}
        <div className="hidden sm:block bg-pink-500">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-12 space-x-8 text-white">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-medium hover:underline"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-accent-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-primary-300">
                FurnitureLab brings you the finest furniture with immersive 3D
                visualization.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/category/living-room"
                    className="text-primary-300 hover:text-white"
                  >
                    Living Room
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/dining-room"
                    className="text-primary-300 hover:text-white"
                  >
                    Dining Room
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/bedroom"
                    className="text-primary-300 hover:text-white"
                  >
                    Bedroom
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/contact"
                    className="text-primary-300 hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping"
                    className="text-primary-300 hover:text-white"
                  >
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link
                    to="/returns"
                    className="text-primary-300 hover:text-white"
                  >
                    Returns
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-primary-300 hover:text-white">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-300 hover:text-white">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-300 hover:text-white">
                    Pinterest
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-700 text-center text-primary-300">
            <p>&copy; 2025 FurnitureHouse.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
