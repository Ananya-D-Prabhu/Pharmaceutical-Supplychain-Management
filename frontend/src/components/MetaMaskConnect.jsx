import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function MetaMaskConnect({ onAccountChange }) {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [chainId, setChainId] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
    
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAccount("");
      if (onAccountChange) onAccountChange("");
    } else {
      setAccount(accounts[0]);
      if (onAccountChange) onAccountChange(accounts[0]);
      getBalance(accounts[0]);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        if (onAccountChange) onAccountChange(accounts[0]);
        getBalance(accounts[0]);
        getChainId();
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        window.open("https://metamask.io/download/", "_blank");
        return;
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setIsConnected(true);
      if (onAccountChange) onAccountChange(accounts[0]);
      getBalance(accounts[0]);
      getChainId();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet: " + error.message);
    }
  };

  const getBalance = async (address) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4));
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  };

  const getChainId = async () => {
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(parseInt(chainId, 16));
    } catch (error) {
      console.error("Error getting chain ID:", error);
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    setBalance("");
    setIsConnected(false);
    if (onAccountChange) onAccountChange("");
  };

  return (
    <div className="metamask-container">
      {!isConnected ? (
        <button onClick={connectWallet} className="connect-button">
          🦊 Connect MetaMask
        </button>
      ) : (
        <div className="wallet-info">
          <div className="account-details">
            <div className="account-label">Connected Account:</div>
            <div className="account-address" title={account}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          </div>
          <div className="balance-info">
            <span className="balance-label">Balance:</span>
            <span className="balance-amount">{balance} ETH</span>
          </div>
          {chainId && (
            <div className="chain-info">
              <span className="chain-label">Network:</span>
              <span className="chain-id">
                {chainId === 31337 ? "Hardhat Local" : chainId === 1 ? "Ethereum Mainnet" : `Chain ${chainId}`}
              </span>
            </div>
          )}
          <button onClick={disconnectWallet} className="disconnect-button">
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
