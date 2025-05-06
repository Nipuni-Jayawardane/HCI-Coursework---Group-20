import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, getUserOrders, updateOrderStatus } = useAppContext();
  const navigate = useNavigate();

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const orders = getUserOrders();

  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* New: Page Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Customer Dashboard
        </h1>

        {/* 1. Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {orders.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="mt-2 text-2xl font-semibold text-yellow-600">
              {orders.filter((o) => o.status === "Pending").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="mt-2 text-2xl font-semibold text-green-600">
              {orders.filter((o) => o.status === "Completed").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="mt-2 text-2xl font-semibold text-red-600">
              {orders.filter((o) => o.status === "Cancelled").length}
            </p>
          </div>
        </div>

        {/* 2. (Optional) Add your filter/search bar here */}

        {/* 3. Responsive Grid of Cards */}
        {orders.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No orders yet. Start shopping to place your first order!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow rounded-lg overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item) => (
                      <img
                        key={item.id}
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-md border-2 border-white object-cover"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <span className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md text-xs font-medium text-gray-600 border-2 border-white">
                        +{order.items.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-900">
                    ${order.total.toFixed(2)}
                  </p>
                  {order.status === "Pending" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "Cancelled")}
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
