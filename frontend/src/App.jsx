import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import AddProduct from "./components/AddProduct";
import AddStatus from "./components/AddStatus";
import AddWorker from "./components/AddWorker";
import ProductHistory from "./components/ProductHistory";
import ProductStatus from "./components/ProductStatus";
import ProductList from "./components/ProductList";
import QRCodeGenerator from "./components/QRCodeGenerator";
import ProductVerification from "./components/ProductVerification";
import MetaMaskConnect from "./components/MetaMaskConnect";
import PerformanceRankings from "./components/PerformanceRankings";
import AssignProduct from "./components/AssignProduct";
import MyAssignments from "./components/MyAssignments";
import contractABI from "./contractConfig";
import "./App.css";
import "./EnhancedStyles.css";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [connectedAccount, setConnectedAccount] = useState("");
  const [userRole, setUserRole] = useState(null); // null, "OWNER", "MANUFACTURER", "DISTRIBUTOR", "TRANSPORTER"
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (connectedAccount) {
      detectUserRole(connectedAccount);
    } else {
      // Reset role when disconnected
      setUserRole(null);
      setIsOwner(false);
    }
  }, [connectedAccount]);

  const detectUserRole = async (account) => {
    console.log("🔍 Detecting role for account:", account);
    try {
      if (!window.ethereum) {
        console.log("MetaMask not installed");
        return;
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
      
      // Check if user is contract owner
      const ownerAddress = await contract.owner();
      console.log("📋 Contract owner:", ownerAddress);
      console.log("📋 Connected account:", account);
      
      if (ownerAddress.toLowerCase() === account.toLowerCase()) {
        console.log("✅ User is OWNER");
        setIsOwner(true);
        setUserRole("OWNER");
        return; // Owner doesn't need to be registered as worker
      }
      
      // Check if user is a registered worker
      const isRegistered = await contract.isRegisteredWorker(account);
      console.log("📋 Is registered worker:", isRegistered);
      
      if (isRegistered) {
        const workerId = await contract.addressToWorkerId(account);
        console.log("📋 Worker ID:", workerId.toString());
        const worker = await contract.workers(workerId);
        console.log("📋 Worker data:", worker);
        
        // worker[2] is the role enum: 0=MANUFACTURER, 1=DISTRIBUTOR, 2=TRANSPORTER
        const roles = ["MANUFACTURER", "DISTRIBUTOR", "TRANSPORTER"];
        const detectedRole = roles[worker[2]];
        console.log("✅ Worker role:", detectedRole);
        setUserRole(detectedRole);
        setIsOwner(false);
      } else {
        // Not owner and not registered worker
        console.log("❌ User not registered");
        setUserRole(null);
        setIsOwner(false);
      }
    } catch (error) {
      console.error("❌ Error detecting user role:", error);
      setUserRole(null);
      setIsOwner(false);
    }
  };

  const handleAccountChange = (account) => {
    setConnectedAccount(account);
  };

  const renderContent = () => {
    switch(activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "addWorker":
        return <AddWorker />;
      case "addProduct":
        return <AddProduct />;
      case "productList":
        return <ProductList />;
      case "myAssignments":
        return (
          <MyAssignments
            onGoToUpdateStatus={() => setActiveTab("updateStatus")}
          />
        );
      case "updateStatus":
        return <AddStatus />;
      case "trackProduct":
        return <ProductHistory />;
      case "productStatus":
        return <ProductStatus />;
      case "qrGenerator":
        return <QRCodeGenerator />;
      case "verification":
        return <ProductVerification />;
      case "performance":
        return <PerformanceRankings />;
      case "assignProduct":
        return <AssignProduct />;
      default:
        return <Dashboard />;
    }
  };

  // Menu items configuration based on roles
  const menuItems = [
    { id: "dashboard", label: "📊 Dashboard", roles: ["OWNER", "MANUFACTURER", "DISTRIBUTOR", "TRANSPORTER"] },
    { id: "addWorker", label: "👤 Add Worker", roles: ["OWNER"] },
    { id: "addProduct", label: "📦 Add Product", roles: ["MANUFACTURER"] },
    { id: "assignProduct", label: "🎯 Assign Workers", roles: ["MANUFACTURER", "DISTRIBUTOR"] },
    { id: "myAssignments", label: "📋 My Assignments", roles: ["DISTRIBUTOR", "TRANSPORTER"] },
    { id: "updateStatus", label: "📝 Update Status", roles: ["DISTRIBUTOR", "TRANSPORTER"] },
    { id: "productList", label: "📋 View Products", roles: ["OWNER", "MANUFACTURER", "DISTRIBUTOR", "TRANSPORTER"] },
    { id: "trackProduct", label: "🔍 Track Product", roles: ["OWNER", "MANUFACTURER", "DISTRIBUTOR", "TRANSPORTER"] },
    { id: "performance", label: "🏆 Performance Rankings", roles: ["OWNER", "MANUFACTURER", "DISTRIBUTOR", "TRANSPORTER"] },
    { id: "qrGenerator", label: "🔲 Generate QR", roles: ["MANUFACTURER", "DISTRIBUTOR"] },
    { id: "verification", label: "✅ Verify Product", roles: ["OWNER", "MANUFACTURER", "DISTRIBUTOR", "TRANSPORTER"] },
  ];

  // Filter menu items based on user role
  const getAvailableMenuItems = () => {
    if (!userRole) return [];
    return menuItems.filter(item => item.roles.includes(userRole));
  };

  const availableMenuItems = getAvailableMenuItems();

  return (
    <div className="app">
      <Navbar>
        <MetaMaskConnect onAccountChange={handleAccountChange} />
      </Navbar>
      
      <div className="main-container">
        <div className="sidebar">
          <div className="sidebar-menu">
            {!connectedAccount ? (
              <div className="sidebar-message">
                <p>🔐 Please connect your wallet</p>
              </div>
            ) : !userRole ? (
              <div className="sidebar-message">
                <p>⚠️ Account not registered</p>
                <small>Contact admin to register as a worker</small>
              </div>
            ) : (
              <>
                <div className="role-badge-container">
                  <span className="role-badge">{userRole}</span>
                </div>
                
                {availableMenuItems.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)} 
                    className={activeTab === item.id ? "active" : ""}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="content">
          {!connectedAccount ? (
            <div className="welcome-screen">
              <h2>👋 Welcome to PharmaDApp</h2>
              <p>Connect your MetaMask wallet to get started</p>
            </div>
          ) : !userRole ? (
            <div className="welcome-screen">
              <h2>⚠️ Account Not Registered</h2>
              <p>Your account <code>{connectedAccount.slice(0, 6)}...{connectedAccount.slice(-4)}</code> is not registered in the system.</p>
              <p>Please contact the system owner to register you as a worker.</p>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>Copyright ©2025 All rights reserved | 💊 Pharmexis</p>
      </footer>
    </div>
  );
}
