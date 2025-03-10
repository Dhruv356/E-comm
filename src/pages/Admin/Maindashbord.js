import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "../Admin/mainadmin.css"; // External CSS

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const Maindashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalRevenue: 0, totalSales: 0 });

  // Fetch Dashboard Stats from Backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dashboard-stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Data for Charts
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ label: "Revenue ($)", data: [12000, 15000, 13000, 18000, 20000, 17000], backgroundColor: "#F84040", borderRadius: 5 }],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ label: "Sales", data: [100, 140, 120, 180, 200, 170], borderColor: "#222831", backgroundColor: "rgba(34, 40, 49, 0.1)", fill: true }],
  };

  return (
    <div className="dashboard-container">
      {/* Analytics Cards */}
      <div className="analytics-cards">
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h3>Total Users</h3>
          <h2>{stats.totalUsers}</h2>
          <p>+15% this month</p>
        </motion.div>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h3>Total Revenue</h3>
          <h2>${stats.totalRevenue}</h2>
          <p>+10% this month</p>
        </motion.div>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h3>Total Sales</h3>
          <h2>{stats.totalSales}</h2>
          <p>+8% this month</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="charts">
        <div className="chart">
          <h3>Revenue Growth</h3>
          <Bar data={barData} />
        </div>
        <div className="chart">
          <h3>Sales Overview</h3>
          <Line data={lineData} />
        </div>
      </div>

      {/* Action Buttons */}
      {/* <div className="action-buttons">
        <button className="btn btn-primary">View Users</button>
        <button className="btn btn-secondary">View Orders</button>
        </div> */}
    </div>
  );
};

export default Maindashboard;
