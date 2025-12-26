import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../contractConfig";
import { verifyMetaMaskSignature } from "../utils/eccCrypto";
import jsQR from "jsqr";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function ProductVerification() {
  const [qrData, setQrData] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [account, setAccount] = useState("");
  const [manualMode, setManualMode] = useState(false);

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

  const verifyQRCode = async (e) => {
    e.preventDefault();

    if (!qrData.trim()) {
      setError("Please paste QR code data");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setVerificationResult(null);

      // Parse QR data
      const parsedData = JSON.parse(qrData);

      if (!parsedData.product || !parsedData.security || !parsedData.verification) {
        throw new Error("Invalid QR code format");
      }

      // Verify signature
      const isSignatureValid = verifyMetaMaskSignature(
        parsedData.security.message,
        parsedData.security.signature,
        parsedData.security.signerAddress
      );

      // Get product from blockchain
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
      
      const productId = parseInt(parsedData.product.id);
      const blockchainProduct = await contract.products(productId);

      // Verify product exists
      const productExists = blockchainProduct.name !== "";

      // Get manufacturer info based on the QR signer's address
      let manufacturerName = "Unknown";
      try {
        const signerAddress = parsedData.security.signerAddress;
        const manufacturerId = await contract.addressToWorkerId(signerAddress);
        const manufacturer = await contract.workers(manufacturerId);
        manufacturerName = manufacturer.name || "Unknown";
      } catch (resolveError) {
        console.error("Error resolving manufacturer from signer:", resolveError);
      }

      // Check if product is spoiled
      const isSpoiled = blockchainProduct.isSpoiled;

      // Get product history
      const history = await contract.getProductHistory(productId);

      const result = {
        isValid: isSignatureValid && productExists,
        signature: {
          valid: isSignatureValid,
          signer: parsedData.security.signerAddress,
          timestamp: new Date(parsedData.security.timestamp).toLocaleString()
        },
        product: {
          id: parsedData.product.id,
          name: parsedData.product.name,
          description: parsedData.product.description,
          tempRange: parsedData.product.tempRange,
          mfgDate: parsedData.product.mfgDate,
          quantity: parsedData.product.quantity,
          isSpoiled: isSpoiled,
          exists: productExists
        },
        blockchain: {
          verified: productExists,
          network: parsedData.verification.network,
          contract: parsedData.verification.contract,
          manufacturer: manufacturerName,
          trackingRecords: history.length
        },
        security: {
          encryption: "ECC secp256k1",
          signed: isSignatureValid,
          tamperProof: true
        }
      };

      setVerificationResult(result);
    } catch (error) {
      console.error("Verification error:", error);
      setError("Failed to verify: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError("");
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            // Create canvas to read image data
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Decode QR code
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });
            
            if (code) {
              setQrData(code.data);
              setManualMode(true);
              alert("✅ QR code scanned successfully! Click 'Verify Authenticity' to check.");
              setLoading(false);
            } else {
              setError("No QR code found in image. Try a clearer image or use manual entry.");
              setLoading(false);
            }
          } catch (err) {
            setError("Failed to decode QR code: " + err.message);
            setLoading(false);
          }
        };
        img.onerror = () => {
          setError("Failed to load image");
          setLoading(false);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError("Failed to read file: " + error.message);
      setLoading(false);
    }
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

            <div className="verification-modes">
              <button 
                className={`mode-btn ${!manualMode ? 'active' : ''}`}
                onClick={() => setManualMode(false)}
              >
                📱 Scan QR Code
              </button>
              <button 
                className={`mode-btn ${manualMode ? 'active' : ''}`}
                onClick={() => setManualMode(true)}
              >
                ⌨️ Manual Entry
              </button>
            </div>

            <form onSubmit={verifyQRCode} className="enhanced-form">
              {!manualMode ? (
                <div className="form-group">
                  <label htmlFor="qrFile">
                    <span className="label-icon">📷</span>
                    Upload QR Code Image
                  </label>
                  <input
                    id="qrFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={loading}
                  />
                  <p className="helper-text">Upload a QR code image (PNG, JPG) to automatically extract and verify the data.</p>
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="qrData">
                    <span className="label-icon">📋</span>
                    Paste QR Code Data
                  </label>
                  <textarea
                    id="qrData"
                    placeholder="Paste the QR code JSON data here..."
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                    disabled={loading}
                    rows="6"
                    required
                  />
                  <p className="helper-text">Copy the QR data from the secure QR generator and paste it here</p>
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
                className="btn-submit"
                disabled={loading || (!manualMode && true)}
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

            {verificationResult && (
              <div className={`verification-result ${verificationResult.isValid ? 'valid' : 'invalid'}`}>
                <div className="result-header">
                  {verificationResult.isValid ? (
                    <>
                      <span className="result-icon">✅</span>
                      <h3>Product Authenticated</h3>
                    </>
                  ) : (
                    <>
                      <span className="result-icon">❌</span>
                      <h3>Verification Failed</h3>
                    </>
                  )}
                </div>

                <div className="result-sections">
                  {/* Signature Verification */}
                  <div className="result-section">
                    <h4>🔐 Cryptographic Signature</h4>
                    <div className="result-grid">
                      <div className="result-item">
                        <span className="result-label">Status:</span>
                        <span className={`result-badge ${verificationResult.signature.valid ? 'valid' : 'invalid'}`}>
                          {verificationResult.signature.valid ? '✅ Valid' : '❌ Invalid'}
                        </span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Signed By:</span>
                        <span className="result-value">
                          {verificationResult.signature.signer.slice(0, 10)}...{verificationResult.signature.signer.slice(-8)}
                        </span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Timestamp:</span>
                        <span className="result-value">{verificationResult.signature.timestamp}</span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Encryption:</span>
                        <span className="result-value">{verificationResult.security.encryption}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="result-section">
                    <h4>📦 Product Details</h4>
                    <div className="result-grid">
                      <div className="result-item">
                        <span className="result-label">Product ID:</span>
                        <span className="result-value">{verificationResult.product.id}</span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Name:</span>
                        <span className="result-value">{verificationResult.product.name}</span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Description:</span>
                        <span className="result-value">{verificationResult.product.description}</span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Temperature Range:</span>
                        <span className="result-value">{verificationResult.product.tempRange}</span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Manufacturing Date:</span>
                        <span className="result-value">{verificationResult.product.mfgDate}</span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Quality Status:</span>
                        <span className={`result-badge ${verificationResult.product.isSpoiled ? 'spoiled' : 'good'}`}>
                          {verificationResult.product.isSpoiled ? '⚠️ Spoiled' : '✅ Good'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Verification */}
                  <div className="result-section">
                    <h4>⛓️ Blockchain Verification</h4>
                    <div className="result-grid">
                      <div className="result-item">
                        <span className="result-label">On-Chain:</span>
                        <span className={`result-badge ${verificationResult.blockchain.verified ? 'valid' : 'invalid'}`}>
                          {verificationResult.blockchain.verified ? '✅ Verified' : '❌ Not Found'}
                        </span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Manufacturer:</span>
                        <span className="result-value">{verificationResult.blockchain.manufacturer}</span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Tracking Records:</span>
                        <span className="result-value">{verificationResult.blockchain.trackingRecords}</span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Network:</span>
                        <span className="result-value">{verificationResult.blockchain.network}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {verificationResult.isValid && (
                  <div className="authenticity-seal">
                    <div className="seal-content">
                      <span className="seal-icon">🏆</span>
                      <div className="seal-text">
                        <strong>AUTHENTIC PRODUCT</strong>
                        <p>Verified with Elliptic Curve Cryptography</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
