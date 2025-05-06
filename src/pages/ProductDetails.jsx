import { useState, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import FurnitureModel from "../components/3d/FurnitureModel";
import { products } from "../data/products";
import {
  ShoppingCartIcon,
  HeartIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToFavorites, removeFromFavorites, favorites } =
    useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [useCustomColor, setUseCustomColor] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [scale, setScale] = useState(100);
  const [activeTab, setActiveTab] = useState("Details");

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const isFavorite = favorites.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleTryInRoom = () => {
    navigate("/room-designer", {
      state: {
        product: {
          ...product,
          customizations: {
            color: useCustomColor ? selectedColor : undefined,
            scale: scale / 100,
          },
        },
      },
    });
  };

  // Available colors for the product
  const availableColors = [
    { name: "White", value: "#FFFFFF" },
    { name: "Brown", value: "#8B4513" },
    { name: "Gray", value: "#808080" },
    { name: "Black", value: "#000000" },
    { name: "Natural Wood", value: "#DEB887" },
    { name: "Silver", value: "#C0C0C0" },
    { name: "Emerald Green", value: "#50C878" },
    { name: "Dark Walnut", value: "#654321" },
    { name: "Black/Walnut", value: "#3B2F2F" },
    { name: "White/Oak", value: "#F5DEB3" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 3D Model Viewer */}
        <div>
          <div className="bg-gray-100 rounded-lg shadow-lg h-64 md:h-80 lg:h-[500px]">
            <Canvas>
              <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[0, 1, 5]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <FurnitureModel
                  modelPath={product.modelUrl}
                  scale={scale / 100}
                  color={useCustomColor ? selectedColor : undefined}
                  autoRotate
                />
                <OrbitControls />
                <Environment preset="apartment" />
              </Suspense>
            </Canvas>
          </div>
        </div>

        {/* Info & Tabs */}
        <div>
          <nav className="flex space-x-4 border-b border-gray-200">
            {["Details", "Specifications", "Customize"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-accent-600 text-accent-600"
                    : "text-primary-700 hover:text-accent-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="pt-6">
            {activeTab === "Details" && (
              <div className="space-y-4">
                <h1 className="text-3xl font-display font-bold text-primary-900">
                  {product.name}
                </h1>
                <p className="mt-2 text-2xl text-primary-700">
                  ${product.price.toFixed(2)}
                </p>
                <h2 className="text-lg font-medium text-primary-900 mb-2">
                  Description
                </h2>
                <p className="text-primary-600">{product.description}</p>
                <div className="border-t pt-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <label
                      htmlFor="quantity"
                      className="font-medium text-primary-900"
                    >
                      Quantity
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="rounded-lg border-gray-300"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={handleToggleFavorite}
                      className={`p-3 rounded-lg border ${
                        isFavorite
                          ? "bg-primary-100 border-primary-200 text-primary-900"
                          : "border-gray-300 text-primary-700 hover:bg-gray-50"
                      }`}
                    >
                      <HeartIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "Specifications" && (
              <div>
                <h2 className="text-lg font-medium text-primary-900 mb-4">
                  Specifications
                </h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="border-t pt-4">
                      <dt className="font-medium text-primary-900 capitalize">
                        {key}
                      </dt>
                      <dd className="mt-1 text-primary-600">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {activeTab === "Customize" && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-primary-900 mb-4">
                    Customize
                  </h3>
                  {/* Color Selection */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-primary-700">
                        Custom Colors
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useCustomColor}
                          onChange={(e) => setUseCustomColor(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
                      </label>
                    </div>
                    {useCustomColor && (
                      <>
                        <label className="block text-sm font-medium text-primary-700 mb-2">
                          Color:{" "}
                          <span className="font-semibold text-accent-600">
                            {
                              availableColors.find(
                                (c) => c.value === selectedColor
                              )?.name
                            }
                          </span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableColors.map(({ name, value }) => (
                            <button
                              key={value}
                              onClick={() => setSelectedColor(value)}
                              className={`w-10 h-10 rounded-lg border-2 focus:outline-none focus:ring-2 ${
                                selectedColor === value
                                  ? "border-accent-600 focus:ring-accent-600"
                                  : "border-gray-200 focus:ring-transparent"
                              }`}
                              style={{ backgroundColor: value }}
                              aria-label={name}
                              title={name}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  {/* Size Adjustment */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Size: {scale}%
                    </label>
                    <input
                      type="range"
                      min="80"
                      max="120"
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="w-full accent-pink-500"
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleTryInRoom}
                    className="px-6 py-2 rounded-lg bg-accent-600 text-white hover:bg-accent-700"
                  >
                    Try in Room
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
