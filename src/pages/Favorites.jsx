import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import { FaHeart, FaSearch } from "react-icons/fa";

export default function Favorites() {
  const { favorites, removeFromFavorites } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get unique categories from favorites
  const categories = [
    "all",
    ...new Set(favorites.map((item) => item.category)),
  ];

  // Filter favorites based on search and category
  const filteredFavorites = favorites.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold">My Favorites</h1>
        <p className="text-gray-600">
          {favorites.length} {favorites.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {favorites && favorites.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search bar */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" />
              <input
                type="text"
                placeholder="Search your favorites..."
                className="w-full pl-10 pr-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category filter */}
            <select
              className="px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {filteredFavorites.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-primary-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-display font-medium text-primary-900 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-display font-medium text-primary-900 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-display font-medium text-primary-900 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-display font-medium text-primary-900 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFavorites.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-4">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded-md"
                        />
                        <Link
                          to={`/product/${product.id}`}
                          className="text-primary-900 font-medium hover:text-accent-600"
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-primary-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-primary-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => removeFromFavorites(product.id)}
                          className="inline-flex items-center p-2 bg-primary-50 text-accent-500 rounded-full hover:bg-primary-100"
                        >
                          <FaHeart className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-primary-600 text-lg">
                No favorites match your search criteria.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-primary-50 rounded-lg">
          <FaHeart className="mx-auto text-gray-300 text-6xl mb-4" />
          <h2 className="text-2xl font-display font-semibold text-primary-900 mb-2">
            Your favorites list is empty
          </h2>
          <p className="text-primary-600 mb-6">
            Start adding items to your favorites to keep track of products you
            love.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
          >
            Explore Products
          </Link>
        </div>
      )}
    </div>
  );
}
