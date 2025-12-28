import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { ethers } from "ethers";
import contractABI from "../contractConfig";
import { signProductWithMetaMask, createSecureQRData, getPublicKeyFingerprint } from "../utils/eccCrypto";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function QRCodeGenerator() {
  const [productId, setProductId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [account, setAccount] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [signatureInfo, setSignatureInfo] = useState(null);
  const [qrJsonData, setQrJsonData] = useState("");

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

  const generateQR = async () => {
    if (!productId) {
      setError("Please enter product ID");
      return;
    }

    if (!account) {
      setError("Please connect your MetaMask wallet first!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setQrCode("");
      setSignatureInfo(null);

      // Get product details from blockchain
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
      
      const product = await contract.products(parseInt(productId));
      
      if (!product.name) {
        throw new Error("Product not found");
      }

      const productData = {
        productId: productId,
        name: product.name,
        description: product.description,
        minTemp: product.minTemp.toString(),
        maxTemp: product.maxTemp.toString(),
        quantity: product.quantity.toString(),
        mfgDate: product.mfgDate,
        timestamp: Date.now(),
        contractAddress: CONTRACT_ADDRESS,
        isSpoiled: product.isSpoiled
      };

      setProductInfo(productData);

      // Sign product data with MetaMask
      const signer = await provider.getSigner();
      const signedData = await signProductWithMetaMask(productData, signer);
      
      setSignatureInfo({
        signature: signedData.signature,
        signerAddress: signedData.signerAddress,
        fingerprint: getPublicKeyFingerprint(signedData.signature)
      });

      // Create secure QR data
      const qrData = JSON.stringify({
        product: {
          id: productData.productId,
          name: productData.name,
          description: productData.description,
          tempRange: `${productData.minTemp}°C to ${productData.maxTemp}°C`,
          mfgDate: productData.mfgDate,
          quantity: productData.quantity,
          isSpoiled: productData.isSpoiled
        },
        security: {
          signature: signedData.signature,
          signerAddress: signedData.signerAddress,
          timestamp: productData.timestamp,
          message: signedData.message
        },
        verification: {
          blockchain: 'Ethereum',
          network: 'Hardhat Local',
          contract: CONTRACT_ADDRESS,
          verifyUrl: `http://localhost:3000/verify/${productId}`
        }
      });

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      });

      setQrCode(qrCodeUrl);
      setQrJsonData(qrData); // Store the JSON data for copying
    } catch (error) {
      console.error("Error generating QR:", error);
      setError(error.message || "Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `product-${productId}-secure-qr.png`;
    link.href = qrCode;
    link.click();
  };

  const downloadQRData = () => {
    const blob = new Blob([qrJsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `product-${productId}-qr-data.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const copyQRData = () => {
    navigator.clipboard.writeText(qrJsonData);
    alert('✅ QR JSON data copied to clipboard!\n\nYou can now paste it in the "Verify Product" page to test verification.');
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <div className="form-header">
          <h2>🔲 Generate Secure QR Code</h2>
          <p className="form-subtitle">Create cryptographically signed QR codes with ECC</p>
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

            <form onSubmit={(e) => { e.preventDefault(); generateQR(); }} className="enhanced-form">
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
                    Generating...
                  </>
                ) : (
                  <>
                    <span>🔐</span>
                    Generate Secure QR
                  </>
                )}
              </button>
            </form>

            {productInfo && signatureInfo && qrCode && (
              <div className="qr-result">
                <div className="security-info">
                  <h3>🔐 Security Information</h3>
                  <div className="security-grid">
                    <div className="security-item">
                      <span className="security-label">✍️ Signed By:</span>
                      <span className="security-value">{signatureInfo.signerAddress.slice(0, 10)}...{signatureInfo.signerAddress.slice(-8)}</span>
                    </div>
                    <div className="security-item">
                      <span className="security-label">🔑 Signature:</span>
                      <span className="security-value">{signatureInfo.signature.slice(0, 20)}...{signatureInfo.signature.slice(-20)}</span>
                    </div>
                    <div className="security-item">
                      <span className="security-label">📦 Product:</span>
                      <span className="security-value">{productInfo.name}</span>
                    </div>
                    <div className="security-item">
                      <span className="security-label">🌡️ Temp Range:</span>
                      <span className="security-value">{productInfo.minTemp}°C to {productInfo.maxTemp}°C</span>
                    </div>
                  </div>
                  <div className="security-badge">
                    ✅ Cryptographically Signed with Elliptic Curve Cryptography (secp256k1)
                  </div>
                </div>

                <div className="qr-display">
                  <img src={qrCode} alt="Secure QR Code" className="qr-image" />
                  <div className="qr-info">
                    <p className="qr-label">🔒 Tamper-Proof QR Code</p>
                    <p className="qr-desc">This QR contains encrypted signature for product authentication</p>
                  </div>
                  
                  <div className="qr-actions">
                    <button 
                      onClick={downloadQR}
                      className="btn-download"
                    >
                      📥 Download QR Image
                    </button>
                    
                    <button 
                      onClick={downloadQRData}
                      className="btn-download"
                      title="Download JSON file for easy upload"
                    >
                      💾 Download JSON File
                    </button>
                    
                    <button 
                      onClick={copyQRData}
                      className="btn-copy-json"
                    >
                      📋 Copy QR Data
                    </button>
                  </div>
                  
                  <div className="json-preview">
                    <h4>📄 QR JSON Data Preview:</h4>
                    <textarea 
                      readOnly 
                      value={qrJsonData}
                      className="json-display"
                      rows="8"
                    />
                    <p className="json-hint">
                      💡 <strong>To verify:</strong> Click "Copy QR JSON Data" button, then go to "Verify Product" page and paste it there.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
