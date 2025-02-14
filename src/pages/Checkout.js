import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./checkout.css"

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const placeOrder = (orderDetails) => {
    console.log("Order Placed:", orderDetails);

    // Simulate backend request (Replace this with actual API call)
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
    <div className="checkout-container">
      <h2>Checkout</h2>
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
          <label>Payment Method:</label>
          <input type="text" value="Cash on Delivery (COD)" disabled />
          
        </div>

        <h3>Order Summary</h3>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <p key={item.id}>
              {item.productName} - ₹{item.price} x {item.qty}
            </p>
          ))
        ) : (
          <p>No items in cart</p>
        )}
        <h3>Total: ₹{totalPrice}</h3>

        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
