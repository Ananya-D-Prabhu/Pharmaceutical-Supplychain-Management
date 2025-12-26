import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../contractConfig";
import "./MyAssignments.css";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function MyAssignments({ onGoToUpdateStatus }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [account, setAccount] = useState("");
  const [workerId, setWorkerId] = useState(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      if (!window.ethereum) {
        setError("Please install MetaMask");
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const currentAccount = accounts[0];
      setAccount(currentAccount);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

      // Get worker ID for current account
      const isRegistered = await contract.isRegisteredWorker(currentAccount);
      if (!isRegistered) {
        setError("You are not registered as a worker");
        setLoading(false);
        return;
      }

      const id = await contract.addressToWorkerId(currentAccount);
      setWorkerId(Number(id));

      // Get assigned products
      const productIds = await contract.getAssignedProducts(id);
      
      if (productIds.length === 0) {
        setAssignments([]);
        setLoading(false);
        return;
      }

      // Fetch product details
      const productDetails = await Promise.all(
        productIds.map(async (productId) => {
          const product = await contract.products(productId);
          const history = await contract.getProductHistory(productId);
          
          return {
            productId: Number(productId),
            name: product.name,
            description: product.description,
            minTemp: Number(product.minTemp),
            maxTemp: Number(product.maxTemp),
            minHumidity: Number(product.minHumidity),
            maxHumidity: Number(product.maxHumidity),
            quantity: Number(product.quantity),
            isSpoiled: product.isSpoiled,
            lastUpdate: history.length > 0 ? {
              location: history[history.length - 1].location,
              temperature: Number(history[history.length - 1].temperature),
              humidity: Number(history[history.length - 1].humidity),
              timestamp: Number(history[history.length - 1].timestamp)
            } : null
          };
        })
      );

      setAssignments(productDetails);
    } catch (error) {
      console.error("Error loading assignments:", error);
      setError(error.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Never";
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <h2>📋 My Assigned Products</h2>
        <p className="subtitle">Products you are responsible for tracking</p>
        {account && (
          <div className="worker-info">
            <span className="worker-badge">Worker ID: {workerId}</span>
            <span className="account-badge">{account.slice(0, 6)}...{account.slice(-4)}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-state">
          <span className="spinner"></span>
          <p>Loading your assignments...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <span className="alert-icon">❌</span>
          {error}
        </div>
      ) : assignments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Assignments Yet</h3>
          <p>You don't have any products assigned to you at the moment.</p>
          <p className="hint">Ask the manufacturer or owner to assign products to you.</p>
        </div>
      ) : (
        <>
          <div className="assignments-count">
            <span className="count-badge">{assignments.length}</span>
            <span className="count-label">Active Assignment{assignments.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="assignments-grid">
            {assignments.map((product) => (
              <div 
                key={product.productId} 
                className={`assignment-card ${product.isSpoiled ? 'spoiled' : ''}`}
              >
                <div className="card-header">
                  <div className="product-title">
                    <span className="product-icon">📦</span>
                    <h3>{product.name}</h3>
                  </div>
                  <span className="product-id">#{product.productId}</span>
                </div>

                {product.isSpoiled && (
                  <div className="spoiled-banner">
                    ⚠️ SPOILED - No Further Updates Allowed
                  </div>
                )}

                <p className="product-description">{product.description}</p>

                <div className="product-requirements">
                  <div className="requirement-item">
                    <span className="req-icon">🌡️</span>
                    <div className="req-details">
                      <span className="req-label">Temperature Range</span>
                      <span className="req-value">{product.minTemp}°C - {product.maxTemp}°C</span>
                    </div>
                  </div>

                  <div className="requirement-item">
                    <span className="req-icon">💧</span>
                    <div className="req-details">
                      <span className="req-label">Humidity Range</span>
                      <span className="req-value">{product.minHumidity}% - {product.maxHumidity}%</span>
                    </div>
                  </div>

                  <div className="requirement-item">
                    <span className="req-icon">📊</span>
                    <div className="req-details">
                      <span className="req-label">Quantity</span>
                      <span className="req-value">{product.quantity} units</span>
                    </div>
                  </div>
                </div>

                {product.lastUpdate ? (
                  <div className="last-update">
                    <h4>Last Update</h4>
                    <div className="update-details">
                      <div className="update-row">
                        <span className="update-label">📍 Location:</span>
                        <span className="update-value">{product.lastUpdate.location}</span>
                      </div>
                      <div className="update-row">
                        <span className="update-label">🌡️ Temp:</span>
                        <span className={`update-value ${
                          product.lastUpdate.temperature < product.minTemp || 
                          product.lastUpdate.temperature > product.maxTemp ? 'violation' : 'ok'
                        }`}>
                          {product.lastUpdate.temperature}°C
                        </span>
                      </div>
                      <div className="update-row">
                        <span className="update-label">💧 Humidity:</span>
                        <span className={`update-value ${
                          product.lastUpdate.humidity < product.minHumidity || 
                          product.lastUpdate.humidity > product.maxHumidity ? 'violation' : 'ok'
                        }`}>
                          {product.lastUpdate.humidity}%
                        </span>
                      </div>
                      <div className="update-row">
                        <span className="update-label">🕐 Time:</span>
                        <span className="update-value">{formatDate(product.lastUpdate.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-updates">
                    <span className="info-icon">ℹ️</span>
                    <span>No status updates yet</span>
                  </div>
                )}

                {!product.isSpoiled && (
                  <button 
                    className="btn-update-status"
                    onClick={() => {
                      if (onGoToUpdateStatus) {
                        onGoToUpdateStatus(product.productId);
                      }
                    }}
                  >
                    ✏️ Update Status
                  </button>
                )}
              </div>
            ))}
          </div>

          <button onClick={loadAssignments} className="btn-refresh">
            🔄 Refresh Assignments
          </button>
        </>
      )}
    </div>
  );
}
