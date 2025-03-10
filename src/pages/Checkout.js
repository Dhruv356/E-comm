import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get cart items & total price from navigation state
  const cartItems = location.state?.cartList || [];
  const buyNowItem = location.state?.orderItems || []; // 👈 Handles "Buy Now" case
  const totalPrice = location.state?.totalPrice || buyNowItem.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
    state: "",
    paymentMethod: "COD",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user details from profile API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        setFormData((prev) => ({
          ...prev,
          name: userData.name || "",
          address: userData.address || "",
          phone: userData.phoneNumber || "",
        }));
      } catch (error) {
        console.error("Error fetching user profile", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Get final items to checkout (cart + buy-now)
  const finalCheckoutItems = cartItems.length > 0 ? cartItems : buyNowItem;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (finalCheckoutItems.length === 0) {
      alert("No items in cart!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to place an order!");
        return;
      }

      const orderDetails = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        paymentMethod: formData.paymentMethod,
        cartItems: finalCheckoutItems.map((item) => ({
          productId: item._id || item.productId, // Handles both cart & buy-now
          name: item.productName || item.name,
          price: item.price,
          qty: item.qty,
          imgUrl: item.imageUrl?.startsWith("/uploads")
            ? `http://localhost:5000${item.imageUrl}`
            : item.imgUrl || "/fallback-image.jpg",
        })),
        totalPrice,
      };

      const response = await axios.post("http://localhost:5000/api/orders", orderDetails, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      alert("🎉 Order placed successfully!");
      navigate("/myorders");
    } catch (error) {
      console.error("❌ Error placing order:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-wrapper">
      {/* Checkout Form */}
      <div className="checkout-container checkout-form">
        <h2>Checkout</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div>
            <label>Phone:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <label>City:</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div>
            <label>State:</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} required />
          </div>
          <div>
            <label>Payment Method:</label>
            <input type="text" value="Cash on Delivery (COD)" disabled />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="checkout-container order-summary">
        <h3>Order Summary</h3>
        {finalCheckoutItems.length > 0 ? (
          finalCheckoutItems.map((item) => (
            <div key={item.productId || item._id} className="order-item">
              <img
                src={
                  item.imageUrl?.startsWith("/uploads")
                    ? `http://localhost:5000${item.imageUrl}`
                    : item.imgUrl || "https://via.placeholder.com/150"
                }
                alt={item.productName || item.name}
                width="100"
              />
              <p>
                {item.productName || item.name} - ₹{item.price} x {item.qty}
              </p>
            </div>
          ))
        ) : (
          <p>No items in cart</p>
        )}
        <div className="order-total">
          <strong>Total:</strong> ₹{totalPrice}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
