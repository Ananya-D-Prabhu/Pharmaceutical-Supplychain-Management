import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../contractConfig";
import "./Dashboard.css";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalWorkers: 0,
    totalUpdates: 0,
    spoiledProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      if (!window.ethereum) {
        setError("Please install MetaMask to view dashboard");
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

      // Get workers count
      const workers = await contract.getWorkers();
      const workersCount = workers.length;

      // Get products count from events
      const productFilter = contract.filters.ProductAdded();
      const productEvents = await contract.queryFilter(productFilter);
      const productsCount = productEvents.length;

      // Get total status updates count
      const statusFilter = contract.filters.StatusUpdated();
      const statusEvents = await contract.queryFilter(statusFilter);
      const updatesCount = statusEvents.length;

      // Count spoiled products
      let spoiledCount = 0;
      for (let i = 0; i < productsCount; i++) {
        const product = await contract.products(i);
        if (product.isSpoiled) {
          spoiledCount++;
        }
      }

      setStats({
        totalProducts: productsCount,
        totalWorkers: workersCount,
        totalUpdates: updatesCount,
        spoiledProducts: spoiledCount
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load dashboard data. Make sure the blockchain is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h2>📊 Dashboard</h2>
      
      {loading ? (
        <div className="loading-state">
          <span className="spinner"></span>
          <p>Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <span className="alert-icon">❌</span>
          {error}
          <button onClick={fetchStats} className="btn-retry">
            🔄 Retry
          </button>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>📦 Total Products</h3>
              <p className="stat-number">{stats.totalProducts}</p>
            </div>
            
            <div className="stat-card">
              <h3>👥 Total Workers</h3>
              <p className="stat-number">{stats.totalWorkers}</p>
            </div>
            
            <div className="stat-card">
              <h3>📍 Status Updates</h3>
              <p className="stat-number">{stats.totalUpdates}</p>
            </div>
            
            <div className="stat-card spoiled-card">
              <h3>⚠️ Spoiled Products</h3>
              <p className="stat-number">{stats.spoiledProducts}</p>
            </div>
          </div>

          <button onClick={fetchStats} className="refresh-btn">
            🔄 Refresh Data
          </button>
        </>
      )}
    </div>
  );
}
