import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../contractConfig";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function AddProductNew() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    minTemp: "",
    maxTemp: "",
    quantity: "",
    mfgDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [account, setAccount] = useState("");
  const [productId, setProductId] = useState(null);

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

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!account) {
      setError("Please connect your MetaMask wallet first!");
      return;
    }

    if (!form.name || !form.description || !form.minTemp || !form.maxTemp || !form.quantity || !form.mfgDate) {
      setError("Please fill in all fields");
      return;
    }

    if (parseInt(form.minTemp) > parseInt(form.maxTemp)) {
      setError("Minimum temperature cannot be greater than maximum temperature");
      return;
    }

    if (parseInt(form.quantity) <= 0) {
      setError("Quantity must be greater than zero");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const tx = await contract.addProduct(
        form.name,
        form.description,
        parseInt(form.minTemp),
        parseInt(form.maxTemp),
        parseInt(form.quantity),
        form.mfgDate
      );
      
      setSuccess("Transaction submitted! Waiting for confirmation...");
      const receipt = await tx.wait();
      
      // Extract product ID from the event
      const event = receipt.logs.find(log => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed.name === "ProductAdded";
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsed = contract.interface.parseLog(event);
        const newProductId = parsed.args[0].toString();
        setProductId(newProductId);
        setSuccess(`✅ Product added successfully! Product ID: ${newProductId}`);
      } else {
        setSuccess(`✅ Product added successfully! TX: ${receipt.hash.slice(0, 10)}...`);
      }

      setForm({ name: "", description: "", minTemp: "", maxTemp: "", quantity: "", mfgDate: "" });
    } catch (error) {
      console.error("Error:", error);
      setError(error.reason || error.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <div className="form-header">
          <h2>📦 Add Product</h2>
          <p className="form-subtitle">Only manufacturers can add products</p>
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

            <form onSubmit={handleAddProduct} className="enhanced-form">
              <div className="form-group">
                <label htmlFor="productName">
                  <span className="label-icon">🏷️</span>
                  Product Name
                </label>
                <input
                  id="productName"
                  type="text"
                  placeholder="e.g., Aspirin 500mg"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productDesc">
                  <span className="label-icon">📝</span>
                  Description
                </label>
                <textarea
                  id="productDesc"
                  placeholder="Enter detailed product description..."
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  disabled={loading}
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="minTemp">
                    <span className="label-icon">❄️</span>
                    Minimum Temperature (°C)
                  </label>
                  <input
                    id="minTemp"
                    type="number"
                    placeholder="e.g., 2"
                    value={form.minTemp}
                    onChange={(e) => handleChange("minTemp", e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="maxTemp">
                    <span className="label-icon">🌡️</span>
                    Maximum Temperature (°C)
                  </label>
                  <input
                    id="maxTemp"
                    type="number"
                    placeholder="e.g., 8"
                    value={form.maxTemp}
                    onChange={(e) => handleChange("maxTemp", e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">
                    <span className="label-icon">📦</span>
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 1000"
                    value={form.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                    disabled={loading}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mfgDate">
                    <span className="label-icon">📅</span>
                    Manufacturing Date
                  </label>
                  <input
                    id="mfgDate"
                    type="date"
                    value={form.mfgDate}
                    onChange={(e) => handleChange("mfgDate", e.target.value)}
                    disabled={loading}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">❌</span>
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  <span className="alert-icon">✅</span>
                  {success}
                  {productId && (
                    <div className="product-id-display">
                      <strong>Use this Product ID to update status:</strong>
                      <div className="id-badge" onClick={() => {
                        navigator.clipboard.writeText(productId);
                        alert("Product ID copied to clipboard!");
                      }}>
                        <span className="id-value">{productId}</span>
                        <span className="copy-hint">📋 Click to copy</span>
                      </div>
                    </div>
                  )}
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
                    Add Product
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
