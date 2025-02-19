import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get cart items & total price from navigation state
  const cartItems = location.state?.cartList || [];
  const totalPrice = location.state?.totalPrice || 0;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "COD",
  });

  // Fetch user details from profile API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        setFormData({
          name: userData.name || "",
          address: userData.address || "",
          phone: userData.phoneNumber || "",
          paymentMethod: "COD", // Default payment method
        });
      } catch (error) {
        console.error("Error fetching user profile", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const placeOrder = (orderDetails) => {
    console.log("Order Placed:", orderDetails);

    // Simulate backend request 
    setTimeout(() => {
      alert("Order placed successfully!");
      navigate("/"); // Redirect to home or orders page
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("No items in cart!");
      return;
    }
    const orderDetails = { ...formData, cartItems, totalPrice };
    placeOrder(orderDetails);
  };



  return (
    <div className="checkout-wrapper">
      {/* Checkout Form */}
      <div className="checkout-container checkout-form">
        <h2>Checkout</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Payment Method:</label>
            <input type="text" value="Cash on Delivery (COD)" disabled />
          </div>

          <button type="submit">Place Order</button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="checkout-container order-summary">
        <h3>Order Summary</h3>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="order-item">
              <img
                src={item.imgUrl}
                alt={item.productName}
                className="order-item-image"
              />
              <p>
                {item.productName} - ₹{item.price} x {item.qty}
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
