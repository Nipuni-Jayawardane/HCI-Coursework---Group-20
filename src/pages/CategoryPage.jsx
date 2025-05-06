import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products, categories } from "../data/products";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  Bars3Icon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export default function CategoryPage() {
  const { category } = useParams();
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categoryInfo = categories.find((c) => c.id === category);
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => product.category === category);

    // Apply price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "name":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  }, [category, priceRange, sortBy]);

  if (!categoryInfo) {
    return <div className="text-center py-12">Category not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Category Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold text-primary-900 mb-4">
          {categoryInfo.name}
        </h1>
        <p className="text-lg text-primary-600">{categoryInfo.description}</p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white shadow rounded p-4">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="md:hidden flex items-center space-x-2 text-primary-600 mb-4 md:mb-0"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          <span>Filters</span>
        </button>

        {/* Sort Options */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
          {/* Mobile Dropdown */}
          <div className="md:hidden flex items-center space-x-2">
            <label htmlFor="sort-mobile" className="text-primary-600">
              Sort:
            </label>
            <select
              id="sort-mobile"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-field bg-gray-100 border border-gray-200 rounded-md text-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-accent-600"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
          {/* Desktop Pills */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => setSortBy("featured")}
              className={`px-3 py-1 text-sm rounded-full ${
                sortBy === "featured"
                  ? "bg-accent-600 text-white"
                  : "bg-gray-100 text-primary-600 hover:bg-gray-200"
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setSortBy("price-low")}
              className={`px-3 py-1 text-sm rounded-full ${
                sortBy === "price-low"
                  ? "bg-accent-600 text-white"
                  : "bg-gray-100 text-primary-600 hover:bg-gray-200"
              }`}
            >
              Price: Low to High
            </button>
            <button
              onClick={() => setSortBy("price-high")}
              className={`px-3 py-1 text-sm rounded-full ${
                sortBy === "price-high"
                  ? "bg-accent-600 text-white"
                  : "bg-gray-100 text-primary-600 hover:bg-gray-200"
              }`}
            >
              Price: High to Low
            </button>
            <button
              onClick={() => setSortBy("name")}
              className={`px-3 py-1 text-sm rounded-full ${
                sortBy === "name"
                  ? "bg-accent-600 text-white"
                  : "bg-gray-100 text-primary-600 hover:bg-gray-200"
              }`}
            >
              Name
            </button>
          </div>
        </div>
        {/* View toggles */}
        <div className="hidden md:flex items-center space-x-3">
          <Bars3Icon className="h-5 w-5 text-primary-600 cursor-pointer" />
          <Squares2X2Icon className="h-5 w-5 text-primary-600 cursor-pointer" />
        </div>
      </div>

      {/* Filter Sidebar (Mobile) */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-primary-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <FilterContent
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Filters */}
        <aside className="hidden md:block w-64 flex-shrink-0 bg-white shadow rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filter</h3>
            <button
              onClick={() => setPriceRange([0, 2000])}
              className="text-sm text-accent-600 hover:underline"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-medium text-primary-700 uppercase">
              Price Range (LKR)
            </h4>
            <FilterContent
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <Link to={`/product/${product.id}`} className="block group">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-primary-600 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-primary-500 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-semibold text-primary-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-xs uppercase text-primary-500">
                        {product.category}
                      </span>
                    </div>
                    <dl className="grid grid-cols-2 gap-2 text-xs text-primary-500">
                      <div>
                        <dt className="font-medium">Size</dt>
                        <dd>{product.specs.dimensions}</dd>
                      </div>
                      <div>
                        <dt className="font-medium">Material</dt>
                        <dd>{product.specs.material}</dd>
                      </div>
                    </dl>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-primary-500">
              No products found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterContent({ priceRange, setPriceRange }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-primary-900 mb-4">
          Price Range
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([parseInt(e.target.value), priceRange[1]])
              }
              className="input-field w-24"
              min="0"
              max={priceRange[1]}
            />
            <span>to</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              className="input-field w-24"
              min={priceRange[0]}
            />
          </div>
          <input
            type="range"
            min="0"
            max="2000"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([parseInt(e.target.value), priceRange[1]])
            }
            className="w-full"
          />
          <input
            type="range"
            min="0"
            max="2000"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
