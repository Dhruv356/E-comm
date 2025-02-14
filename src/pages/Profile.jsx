import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../pages/profile.css";

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
        setImage(response.data.profileImage || null);
        setAddress(response.data.address || "");
        setPhoneNumber(response.data.phoneNumber || "");
        setShippingAddress(response.data.shippingAddress || "");
        setOrderHistory(response.data.orderHistory || []);
      } catch (error) {
        console.error("Error fetching profile", error);
        alert("Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login"); // Just redirect without using setUser
  };
  

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.post(
          "http://localhost:5000/api/upload-profile-image",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setImage(response.data.profileImage);
        alert("Profile image updated successfully!");
      } catch (error) {
        console.error("Error uploading image", error);
        alert("Failed to upload image");
      }
    }
  };

 const handleSaveChanges = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    navigate("/login");
    return;
  }

  try {
    setIsLoading(true);
    await axios.post(
      "http://localhost:5000/api/profile", // ✅ FIXED: Changed from `/update-profile` to `/profile`
      { address, phoneNumber, shippingAddress },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="profile-page">
      <div className="profile-container">
        {isLoading ? (
          <p className="loading-text">Loading...</p>
        ) : profile ? (
          <>
            <div className="profile-header">
              <div className="profile-image">
                {image ? (
                  <img src={`http://localhost:5000${image}`} alt="Profile" />
                ) : (
                  <span>No Image</span>
                )}
              </div>

              <label className="upload-btn">
                Upload Image
                <input type="file" onChange={handleImageUpload} />
              </label>
            </div>

            <div className="profile-info">
              <h2>{profile?.name}</h2>
              <p>{profile?.email}</p>
            </div>

            <div className="profile-edit-form">
              <div className="form-group">
                <label>Delivery Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Shipping Address</label>
                <input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
              </div>

              <button className="submit-btn" onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>

            <div className="order-history-section">
              <h3>Order History</h3>
              {orderHistory.length > 0 ? (
                <ul>
                  {orderHistory.map((order, index) => (
                    <li key={index}>
                      Order #{order.id} - {order.date} - {order.status}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No orders found.</p>
              )}
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <p className="login-prompt">
            Please <a href="/login">Login</a> to see your profile.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
