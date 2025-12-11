import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../contractConfig";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function ProductHistoryNew() {
  const [id, setId] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [account, setAccount] = useState("");

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (error) {
      setError("Failed to connect wallet: " + error.message);
    }
  };

  const loadHistory = async (e) => {
    e.preventDefault();

    if (!account) {
      setError("Please connect your MetaMask wallet first!");
      return;
    }

    if (!id) {
      setError("Please enter a product ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setHistory([]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

      const result = await contract.getProductHistory(parseInt(id));
      
      if (result.length === 0) {
        setError("No history found for this product");
      } else {
        const formattedHistory = result.map((h, i) => ({
          index: i + 1,
          location: h.location,
          temperature: h.temperature.toString(),
          workerId: h.workerId.toString(),
          quantity: h.quantity.toString(),
          isSpoiled: h.isSpoiled,
          timestamp: new Date(Number(h.timestamp) * 1000).toLocaleString(),
        }));
        setHistory(formattedHistory);
      }
    } catch (error) {
      console.error("Error loading history:", error);
      setError(error.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <div className="form-header">
          <h2>📜 Product History</h2>
          <p className="form-subtitle">View the complete tracking history of a product</p>
        </div>

        {!account ? (
          <div className="connect-prompt">
            <p>Please connect your MetaMask wallet to continue</p>
            <button onClick={connectWallet} className="btn-primary">
              🦊 Connect MetaMask
            </button>
          </div>
        ) : (
          <>
            <div className="connected-account">
              <span className="account-label">Connected:</span>
              <span className="account-address">{account.slice(0, 6)}...{account.slice(-4)}</span>
            </div>

            <form onSubmit={loadHistory} className="enhanced-form">
              <div className="form-group">
                <label htmlFor="productId">
                  <span className="label-icon">🔢</span>
                  Product ID
                </label>
                <input
                  id="productId"
                  type="number"
                  placeholder="Enter product ID to view history"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">❌</span>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    View History
                  </>
                )}
              </button>
            </form>

            {history.length > 0 && (
              <div className="history-results">
                <h3>📊 Tracking History ({history.length} records)</h3>
                <div className="timeline">
                  {history.map((h) => (
                    <div key={h.index} className="timeline-item">
                      <div className="timeline-marker">{h.index}</div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h4>📍 {h.location}</h4>
                          <span className="timeline-date">{h.timestamp}</span>
                        </div>
                        <div className="status-grid">
                          <div className="status-item">
                            <span className="status-label">🌡️ Temperature:</span>
                            <span className="status-value">{h.temperature}°C</span>
                          </div>
                          <div className="status-item">
                            <span className="status-label">📊 Quantity:</span>
                            <span className="status-value">{h.quantity}</span>
                          </div>
                          <div className="status-item">
                            <span className="status-label">👤 Worker ID:</span>
                            <span className="status-value">{h.workerId}</span>
                          </div>
                          <div className="status-item full-width">
                            <span className="status-label">⚠️ Status:</span>
                            <span className={`quality-badge ${h.isSpoiled ? "spoiled" : "maintained"}`}>
                              {h.isSpoiled ? "❌ SPOILED - Temperature Out of Range" : "✅ Quality Maintained"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
