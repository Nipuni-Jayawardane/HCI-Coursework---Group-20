import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { products } = useContext(AppContext);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const filteredProducts = products.filter((product) => {
      const searchTerm = query.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    });

    setSearchResults(filteredProducts);
  }, [query, products]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      {query && (
        <p className="text-gray-600 mb-8">Showing results for "{query}"</p>
      )}

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          {query ? (
            <p className="text-gray-600 text-lg">
              No products found matching "{query}". Try a different search term.
            </p>
          ) : (
            <p className="text-gray-600 text-lg">
              Enter a search term to find products.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
