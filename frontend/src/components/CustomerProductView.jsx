import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../contractConfig";
import jsQR from "jsqr";
import "./SuccessModal.css";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function CustomerProductView() {
  const [productId, setProductId] = useState("");
  const [qrData, setQrData] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [productHistory, setProductHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [account, setAccount] = useState("");
  const [inputMethod, setInputMethod] = useState("manual"); // "manual" or "qr"

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

  const handleQRUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is JSON
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        // Handle JSON files
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const qrText = event.target.result;
            const qrJson = JSON.parse(qrText);
            if (qrJson.product && qrJson.product.id !== undefined) {
              setProductId(qrJson.product.id.toString());
              setQrData(qrText);
              setError("");
            } else {
              setError("Invalid QR code format");
            }
          } catch (err) {
            setError("Failed to parse QR code data");
          }
        };
        reader.readAsText(file);
      } else if (file.type.startsWith("image/")) {
        // Handle image files - decode QR code from image
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            try {
              // Create canvas and get image data
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              
              // Try multiple decoding strategies
              let code = null;
              
              // Strategy 1: Normal decoding
              code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
              });
              
              // Strategy 2: Try with inversion attempts
              if (!code) {
                code = jsQR(imageData.data, imageData.width, imageData.height, {
                  inversionAttempts: "attemptBoth",
                });
              }
              
              // Strategy 3: Try with increased resolution
              if (!code && (img.width < 500 || img.height < 500)) {
                const scale = 2;
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const scaledImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                code = jsQR(scaledImageData.data, scaledImageData.width, scaledImageData.height, {
                  inversionAttempts: "attemptBoth",
                });
              }
              
              if (code) {
                try {
                  const qrJson = JSON.parse(code.data);
                  if (qrJson.product && qrJson.product.id !== undefined) {
                    setProductId(qrJson.product.id.toString());
                    setQrData(code.data);
                    setError("");
                  } else {
                    setError("Invalid QR code format");
                  }
                } catch (parseErr) {
                  setError("QR code does not contain valid product data");
                }
              } else {
                setError("No QR code found in image. Try: 1) Taking a clearer photo 2) Ensuring good lighting 3) Using the JSON file instead for best results.");
              }
            } catch (err) {
              console.error("QR decode error:", err);
              setError("Failed to decode QR code from image");
            }
          };
          img.onerror = () => {
            setError("Failed to load image file");
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        setError("Please upload a JSON file or QR code image (PNG/JPG)");
      }
    }
  };

  const fetchProductDetails = async (e) => {
    e.preventDefault();

    if (!account) {
      setError("Please connect your MetaMask wallet first!");
      return;
    }

    if (!productId) {
      setError("Please enter a product ID or upload QR code");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setProductInfo(null);
      setProductHistory([]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

      // Get product details
      const product = await contract.products(parseInt(productId));
      
      setProductInfo({
        id: productId,
        name: product[1],
        description: product[2],
        minTemp: product[3].toString(),
        maxTemp: product[4].toString(),
        minHumidity: product[5].toString(),
        maxHumidity: product[6].toString(),
        quantity: product[7].toString(),
        manufacturingDate: product[8],
        currentOwner: product[10].toString(),
        isSpoiled: product[11]
      });

      // Get product history
      const historyResult = await contract.getProductHistory(parseInt(productId));
      const history = historyResult.map((status) => ({
        location: status.location,
        temperature: status.temperature.toString(),
        humidity: status.humidity.toString(),
        quantity: status.quantity.toString(),
        timestamp: new Date(Number(status.timestamp) * 1000).toLocaleString(),
        workerId: status.workerId.toString(),
        isSpoiled: status.isSpoiled
      }));
      
      setProductHistory(history);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(error.reason || error.message || "Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const getComplianceStatus = (temp, humidity) => {
    if (!productInfo) return "unknown";
    
    const tempInRange = parseInt(temp) >= parseInt(productInfo.minTemp) && 
                        parseInt(temp) <= parseInt(productInfo.maxTemp);
    const humidityInRange = parseInt(humidity) >= parseInt(productInfo.minHumidity) && 
                            parseInt(humidity) <= parseInt(productInfo.maxHumidity);
    
    return tempInRange && humidityInRange ? "compliant" : "violation";
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <div className="form-header">
          <h2>🔍 Verify Product QR Code</h2>
          <p className="form-subtitle">Authenticate products using ECC signature verification</p>
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

            <form onSubmit={fetchProductDetails} className="enhanced-form">
              <div className="verification-tabs">
                <button
                  type="button"
                  className={`tab-button ${inputMethod === "qr" ? "active" : ""}`}
                  onClick={() => setInputMethod("qr")}
                >
                  📱 Scan QR Code
                </button>
                <button
                  type="button"
                  className={`tab-button ${inputMethod === "manual" ? "active" : ""}`}
                  onClick={() => setInputMethod("manual")}
                >
                  ⌨️ Manual Entry
                </button>
              </div>

              {inputMethod === "qr" ? (
                <div className="form-group upload-section">
                  <label htmlFor="qrUpload" className="upload-label">
                    <span className="label-icon">📄</span>
                    Upload QR Code Image
                  </label>
                  <input
                    id="qrUpload"
                    type="file"
                    accept=".json,.png,.jpg,.jpeg"
                    onChange={handleQRUpload}
                    disabled={loading}
                    className="file-input"
                  />
                  <p className="upload-hint">
                    Upload a QR code image (PNG, JPG) or JSON file to automatically extract and verify the data
                  </p>
                  {productId && (
                    <div className="success-badge">
                      ✓ Product ID detected: {productId}
                    </div>
                  )}
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="productId">
                    <span className="label-icon">🔢</span>
                    Product ID
                  </label>
                  <input
                    id="productId"
                    type="number"
                    placeholder="Enter product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              )}

              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">❌</span>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-submit verify-btn"
                disabled={loading || !productId}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <span>🔐</span>
                    Verify Authenticity
                  </>
                )}
              </button>
            </form>

            {productInfo && (
              <div style={{ marginTop: "30px" }}>
                <div className="product-details-card">
                  <h3>📦 Product Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Product ID:</span>
                      <span className="detail-value">{productInfo.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{productInfo.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Description:</span>
                      <span className="detail-value">{productInfo.description}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className={`detail-value ${productInfo.isSpoiled ? 'status-spoiled' : 'status-safe'}`}>
                        {productInfo.isSpoiled ? "⚠️ SPOILED" : "✅ SAFE"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Temperature Range:</span>
                      <span className="detail-value">{productInfo.minTemp}°C to {productInfo.maxTemp}°C</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Humidity Range:</span>
                      <span className="detail-value">{productInfo.minHumidity}% to {productInfo.maxHumidity}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Current Quantity:</span>
                      <span className="detail-value">{productInfo.quantity} units</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Manufacturing Date:</span>
                      <span className="detail-value">{productInfo.manufacturingDate}</span>
                    </div>
                  </div>
                </div>

                <div className="product-history-card">
                  <h3>📍 Product Tracking History</h3>
                  {productHistory.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#666" }}>No tracking history available</p>
                  ) : (
                    <div className="history-timeline">
                      {productHistory.map((entry, index) => (
                        <div key={index} className={`history-entry ${getComplianceStatus(entry.temperature, entry.humidity)}`}>
                          <div className="history-header">
                            <span className="history-number">#{index + 1}</span>
                            <span className="history-timestamp">{entry.timestamp}</span>
                          </div>
                          <div className="history-details">
                            <div className="history-row">
                              <span className="history-icon">📍</span>
                              <span className="history-label">Location:</span>
                              <span className="history-value">{entry.location}</span>
                            </div>
                            <div className="history-row">
                              <span className="history-icon">🌡️</span>
                              <span className="history-label">Temperature:</span>
                              <span className="history-value">{entry.temperature}°C</span>
                            </div>
                            <div className="history-row">
                              <span className="history-icon">💧</span>
                              <span className="history-label">Humidity:</span>
                              <span className="history-value">{entry.humidity}%</span>
                            </div>
                            <div className="history-row">
                              <span className="history-icon">📊</span>
                              <span className="history-label">Quantity:</span>
                              <span className="history-value">{entry.quantity} units</span>
                            </div>
                            {entry.isSpoiled && (
                              <div className="spoilage-warning">
                                ⚠️ Spoilage detected at this checkpoint
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx="true">{`
        .product-details-card, .product-history-card {
          background: #f9f9f9;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid #e0e0e0;
        }

        .product-details-card h3, .product-history-card h3 {
          margin: 0 0 20px 0;
          color: #333;
          border-bottom: 2px solid #667eea;
          padding-bottom: 10px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .detail-label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .detail-value {
          font-size: 16px;
          color: #333;
          font-weight: 600;
        }

        .status-safe {
          color: #28a745;
        }

        .status-spoiled {
          color: #dc3545;
        }

        .history-timeline {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .history-entry {
          background: white;
          border-radius: 8px;
          padding: 15px;
          border-left: 4px solid #667eea;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .history-entry.violation {
          border-left-color: #dc3545;
          background: #fff5f5;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .history-number {
          font-weight: bold;
          color: #667eea;
        }

        .history-timestamp {
          font-size: 12px;
          color: #666;
        }

        .history-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .history-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .history-icon {
          font-size: 18px;
        }

        .history-label {
          font-size: 13px;
          color: #666;
          min-width: 100px;
        }

        .history-value {
          font-weight: 600;
          color: #333;
        }

        .spoilage-warning {
          margin-top: 10px;
          padding: 10px;
          background: #dc3545;
          color: white;
          border-radius: 5px;
          text-align: center;
          font-weight: bold;
        }

        .verification-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
        }

        .tab-button {
          flex: 1;
          padding: 12px 20px;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tab-button:hover {
          border-color: #667eea;
          background: #f8f9ff;
        }

        .tab-button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }

        .upload-section {
          background: #f8f9ff;
          padding: 25px;
          border-radius: 10px;
          border: 2px dashed #667eea;
          text-align: center;
        }

        .upload-label {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 15px;
        }

        .file-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background: white;
        }

        .upload-hint {
          margin-top: 10px;
          font-size: 13px;
          color: #666;
        }

        .success-badge {
          margin-top: 15px;
          padding: 10px;
          background: #d4edda;
          color: #155724;
          border-radius: 5px;
          font-weight: 600;
        }

        .verify-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin-top: 20px;
        }

        .verify-btn:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4290 100%);
        }
      `}</style>
    </div>
  );
}
