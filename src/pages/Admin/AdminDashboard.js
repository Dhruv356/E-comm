import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaUsers, FaBoxOpen, FaChartBar, FaBars, FaTimes } from "react-icons/fa";
import "../Admin/admin.css";
import { Manageuser } from "../Admin/Manageuser";
import { ManageProduct } from "../Admin/ManageProduct";
import ProductList from "./Productlist";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem("authToken");
  
        if (!token) {
          throw new Error("No token found");
        }
  
        const response = await fetch("http://localhost:5000/api/auth/verify-admin", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
  
        if (!response.ok || data.role !== "admin") {
          throw new Error("Unauthorized access");
        }
      } catch (error) {
        alert("Access Denied: Admins only!");
        localStorage.removeItem("authToken"); // Remove invalid token
        localStorage.removeItem("userRole");
        navigate("/"); // Redirect to homepage
      }
    };
  
    verifyAdmin();
  }, [navigate]);
  
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Admin Panel</h2>
          
        </div>

        <nav>
          <ul>
            <li>
              <Link to="/admin/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>
                <FaChartBar /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/manage-users" className="nav-link" onClick={() => setIsOpen(false)}>
                <FaUsers /> Manage Users
              </Link>
            </li>
            <li>
              <Link to="/admin/manage-products" className="nav-link" onClick={() => setIsOpen(false)}>
                <FaBoxOpen /> Manage Products
              </Link>
            </li>
            <li>
              <Link to="/admin/product-list" className="nav-link" onClick={() => setIsOpen(false)}>
                <FaBars /> Product List  
              </Link>
            </li>
            
            
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <nav className="admin-navbar">
          <h2 className="navbar-title"> Hello Admin </h2>
          
        </nav>

        <div className="content-area">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="manage-users" element={<Manageuser />} />
            <Route path="manage-products" element={<ManageProduct />} />
            <Route path="product-list" element={<ProductList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Dashboard Page with Dynamic Chart Data
const Dashboard = () => {
  const [stats, setStats] = useState({ users: 11150, orders: 2564, revenue: 5214 });

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const token = localStorage.getItem("authToken");
  //       const response = await axios.get("http://localhost:5000/api/admin/stats", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setStats(response.data);
  //     } catch (error) {
  //       console.error("Error fetching dashboard stats:", error);
  //     }
  //   };

  //   fetchStats();
  // }, []);

  const data = {
    labels: ["Users", "Orders", "Revenue"],
    datasets: [
      {
        label: "Statistics",
        data: [stats.users, stats.orders, stats.revenue],
        backgroundColor: ["#2563eb", "#f59e0b", "#10b981"],
      },
    ],
  };

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <div className="grid-container">
        <Card title="Total Users" number={stats.users} icon={<FaUsers />} />
        <Card title="Total Orders" number={stats.orders} icon={<FaBoxOpen />} />
        <Card title="Total Revenue" number={`₹${stats.revenue}`} icon={<FaChartBar />} />
      </div>

      {/* Chart Section */}
      <div className="chart-container">
        <Bar data={data} />
      </div>
    </div>
  );
};

// Card Component
const Card = ({ title, number, icon }) => (
  <div className="card">
    <div className="card-icon">{icon}</div>
    <h3 className="card-title">{title}</h3>
    <p className="card-number">{number}</p>
  </div>
);




export default AdminDashboard;
