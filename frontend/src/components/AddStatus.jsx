import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../contractConfig";
import "./SuccessModal.css";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function AddStatusNew() {
  const [data, setData] = useState({
    productId: "",
    location: "",
    temperature: "",
    humidity: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [account, setAccount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [productId, setProductId] = useState("");

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

  const submitStatus = async (e) => {
    e.preventDefault();

    if (!account) {
      setError("Please connect your MetaMask wallet first!");
      return;
    }

    if (!data.productId || !data.location || !data.temperature || !data.humidity || !data.quantity) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const tx = await contract.updateStatus(
        parseInt(data.productId),
        data.location,
        parseInt(data.temperature),
        parseInt(data.humidity),
        parseInt(data.quantity)
      );

      setSuccess("Transaction submitted! Waiting for confirmation...");
      const receipt = await tx.wait();
      
      setTxHash(receipt.hash);
      setProductId(data.productId);
      setSuccess(`Status updated successfully!`);
      setShowModal(true);

      setData({ productId: "", location: "", temperature: "", humidity: "", quantity: "" });
    } catch (error) {
      console.error("Error:", error);
      setError(error.reason || error.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <div className="form-header">
          <h2>📍 Update Product Status</h2>
          <p className="form-subtitle">Only distributors and transporters can update status</p>
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

            <form onSubmit={submitStatus} className="enhanced-form">
              <div className="form-group">
                <label htmlFor="productId">
                  <span className="label-icon">🔢</span>
                  Product ID
                </label>
                <input
                  id="productId"
                  type="number"
                  placeholder="Enter product ID"
                  value={data.productId}
                  onChange={(e) => handleChange("productId", e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">
                  <span className="label-icon">📍</span>
                  Current Location
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="e.g., Warehouse A, City"
                  value={data.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="temperature">
                    <span className="label-icon">🌡️</span>
                    Current Temperature (°C)
                  </label>
                  <input
                    id="temperature"
                    type="number"
                    placeholder="e.g., 5"
                    value={data.temperature}
                    onChange={(e) => handleChange("temperature", e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="humidity">
                    <span className="label-icon">💧</span>
                    Current Humidity (%)
                  </label>
                  <input
                    id="humidity"
                    type="number"
                    placeholder="e.g., 45"
                    value={data.humidity}
                    onChange={(e) => handleChange("humidity", e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">
                  <span className="label-icon">📊</span>
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 100"
                  value={data.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
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
                    Processing...
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    Update Status
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="success-icon">✅</div>
              <h3>Success!</h3>
            </div>
            <div className="modal-body">
              <p className="modal-message">{success}</p>
              <div className="product-id-section">
                <span className="info-label">Product ID:</span>
                <div className="id-display">
                  <code className="id-value">{productId}</code>
                </div>
              </div>
              <div className="tx-info">
                <span className="tx-label">Transaction Hash:</span>
                <div className="tx-hash">
                  <code>{txHash.slice(0, 10)}...{txHash.slice(-8)}</code>
                  <button 
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(txHash);
                    }}
                    title="Copy full hash"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
