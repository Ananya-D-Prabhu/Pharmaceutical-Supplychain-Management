import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../contractConfig";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [account, setAccount] = useState("");

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    if (account) {
      loadProducts();
    }
  }, [account]);

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

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

      // Get all ProductAdded events
      const filter = contract.filters.ProductAdded();
      const events = await contract.queryFilter(filter);

      // Load product details for each ID
      const productPromises = events.map(async (event) => {
        const productId = event.args[0];
        const product = await contract.products(productId);
        return {
          id: productId.toString(),
          name: product.name,
          description: product.description,
          minTemp: product.minTemp.toString(),
          maxTemp: product.maxTemp.toString(),
          quantity: product.quantity.toString(),
          mfgDate: product.mfgDate,
          isSpoiled: product.isSpoiled,
          timestampCreated: new Date(Number(product.timestampCreated) * 1000).toLocaleString(),
        };
      });

      const loadedProducts = await Promise.all(productPromises);
      setProducts(loadedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Failed to load products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyProductId = (id) => {
    navigator.clipboard.writeText(id);
    alert(`Product ID ${id} copied to clipboard!`);
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <div className="form-header">
          <h2>📋 All Products</h2>
          <p className="form-subtitle">View all products with their IDs for status updates</p>
        </div>

        {!account ? (
          <div className="connect-prompt">
            <p>Please connect your MetaMask wallet to continue</p>
            <button onClick={connectWallet} className="btn-primary">
              🦊 Connect MetaMask
            </button>
          </div>
        ) : loading ? (
          <div className="loading-state">
            <span className="spinner"></span>
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <span className="alert-icon">❌</span>
            {error}
            <button onClick={loadProducts} className="btn-retry">
              🔄 Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>📦 No products found</p>
            <p className="empty-subtitle">Add a product to get started</p>
          </div>
        ) : (
          <>
            <div className="product-list">
              {products.map((product) => (
                <div key={product.id} className={`product-card ${product.isSpoiled ? 'spoiled-product' : ''}`}>
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <div className="product-id-badge" onClick={() => copyProductId(product.id)}>
                      <span className="badge-label">ID:</span>
                      <span className="badge-value">{product.id}</span>
                      <span className="copy-icon">📋</span>
                    </div>
                  </div>
                  
                  {product.isSpoiled && (
                    <div className="spoiled-alert">
                      ⚠️ SPOILED - Temperature violation detected
                    </div>
                  )}
                  
                  <div className="product-details">
                    <div className="detail-row">
                      <span className="detail-label">📝 Description:</span>
                      <span className="detail-value">{product.description}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">🌡️ Required Temp Range:</span>
                      <span className="detail-value">{product.minTemp}°C to {product.maxTemp}°C</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">📦 Quantity:</span>
                      <span className="detail-value">{product.quantity}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">📅 Mfg Date:</span>
                      <span className="detail-value">{product.mfgDate}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">⏰ Created:</span>
                      <span className="detail-value">{product.timestampCreated}</span>
                    </div>
                  </div>
                  
                  <div className="product-actions">
                    <button 
                      className="btn-secondary btn-sm"
                      onClick={() => copyProductId(product.id)}
                    >
                      📋 Copy ID
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={loadProducts} className="btn-refresh">
              🔄 Refresh Products
            </button>
          </>
        )}
      </div>
    </div>
  );
}
