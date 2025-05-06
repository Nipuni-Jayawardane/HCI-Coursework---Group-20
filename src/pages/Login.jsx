import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(formData);
      if (success) {
        // Check if it's admin credentials
        if (
          formData.email === "admin@example.com" &&
          formData.password === "admin"
        ) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:block"
        >
          <img
            src="/images/bedroom.png"
            alt="Furniture in 3D"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-8"
        >
          <h2 className="text-3xl font-display font-bold text-primary-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-primary-600 mb-6">
            Sign in to continue to your dashboard
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field mt-1 w-full"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primary-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field mt-1 w-full"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-primary-600">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm font-medium text-accent-600 hover:text-accent-500"
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-primary-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-medium text-accent-600 hover:text-accent-500"
            >
              Create one
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
