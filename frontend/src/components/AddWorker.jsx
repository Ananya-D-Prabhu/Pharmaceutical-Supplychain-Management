import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../contractConfig";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function AddWorker() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("0");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  const handleAddWorker = async (e) => {
    e.preventDefault();
    
    if (!account) {
      setError("Please connect your MetaMask wallet first!");
      return;
    }

    if (!name.trim() || !walletAddress.trim()) {
      setError("Please fill in all fields");
      return;
    }

    // Validate Ethereum address format
    try {
      ethers.getAddress(walletAddress); // This will throw if invalid
    } catch {
      setError("Invalid wallet address format. Please enter a valid Ethereum address (0x...)");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const tx = await contract.registerWorker(name, parseInt(role), walletAddress);
      setSuccess("Transaction submitted! Waiting for confirmation...");
      
      const receipt = await tx.wait();
      setSuccess(`✅ Worker registered successfully! TX: ${receipt.hash.slice(0, 10)}...`);
      
      setName("");
      setRole("0");
      setWalletAddress("");
      
      setTimeout(() => setSuccess(""), 5000);
    } catch (error) {
      console.error("Error adding worker:", error);
      setError(error.reason || error.message || "Failed to add worker");
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (roleNum) => {
    const roles = { "0": "Manufacturer", "1": "Distributor", "2": "Transporter" };
    return roles[roleNum] || "Unknown";
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <div className="form-header">
          <h2>👤 Register Worker</h2>
          <p className="form-subtitle">Only contract owner can register workers</p>
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

            <form onSubmit={handleAddWorker} className="enhanced-form">
              <div className="form-group">
                <label htmlFor="workerName">
                  <span className="label-icon">📝</span>
                  Worker Name
                </label>
                <input
                  id="workerName"
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="walletAddress">
                  <span className="label-icon">🔑</span>
                  Wallet Address
                </label>
                <input
                  id="walletAddress"
                  type="text"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  disabled={loading}
                  required
                />
                <small className="field-hint">The Ethereum address of this worker</small>
              </div>

              <div className="form-group">
                <label htmlFor="workerRole">
                  <span className="label-icon">💼</span>
                  Role
                </label>
                <select 
                  id="workerRole"
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                  className="role-select"
                >
                  <option value="0">🏭 Manufacturer</option>
                  <option value="1">📦 Distributor</option>
                  <option value="2">🚚 Transporter</option>
                </select>
                <small className="field-hint">Selected: {getRoleLabel(role)}</small>
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
                    Register Worker
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