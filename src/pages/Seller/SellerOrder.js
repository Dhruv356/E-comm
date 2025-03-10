import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const sellerId = localStorage.getItem("userId"); // ✅ Get seller ID from localStorage

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const fetchSellerOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/orders/seller-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Seller Orders Data:", response.data.orders); // Debugging log

      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching seller orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, productId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/update-status/${orderId}/${productId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Order status updated!");
      fetchSellerOrders();
    } catch (error) {
      alert("❌ Failed to update order status.");
    }
  };
  // ✅ Filter only seller-specific orders
  const filteredOrders = orders.filter(order => 
    order.items.some(item => item.sellerId && item.sellerId.toString() === sellerId)
  );

  return (
    <div className="seller-orders-container">
      <h2>📦 Manage Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Address</th> {/* ✅ Show Address */}
              <th>Phone</th> {/* ✅ Show Phone */}
              <th>Product</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) =>
              order.items
                .filter(item => item.sellerId && item.sellerId.toString() === sellerId)
                .map((item) => (
                  <tr key={item.productId}>
                    <td>{order._id}</td>
                    <td>{order.userId?.name || "Unknown"}</td>
                    <td>{order.shippingAddress}</td> {/* ✅ Display address */}
                    <td>{order.phone}</td> {/* ✅ Display phone */}
                    <td>
                      <img src={item.image} alt={item.name} className="product-img" />
                      {item.name}
                    </td>
                    <td>{item.quantity}</td>
                    <td>
                      <span className={`status ${item.status ? item.status.toLowerCase() : "pending"}`}>
                        {item.status || "Pending"}
                      </span>
                    </td>
                    <td>
  {item.status !== "Delivered" && (
    <select
      value={item.status}
      onChange={(e) =>
        updateOrderStatus(order._id, 
          typeof item.productId === "object" ? item.productId._id : item.productId, 
          e.target.value)
      }
    >
      <option value="Processing">Processing</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
    </select>
  )}
</td>


                  </tr>
                ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SellerOrders;
