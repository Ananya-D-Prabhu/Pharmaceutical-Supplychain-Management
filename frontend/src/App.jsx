import React, { useState } from "react";
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
import "./App.css";
import "./EnhancedStyles.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [connectedAccount, setConnectedAccount] = useState("");

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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Navbar>
        <MetaMaskConnect onAccountChange={handleAccountChange} />
      </Navbar>
      
      <div className="main-container">
        <div className="sidebar">
          <h3>📋 Menu</h3>
          <button onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "active" : ""}>
            📊 Dashboard
          </button>
          <button onClick={() => setActiveTab("addWorker")} className={activeTab === "addWorker" ? "active" : ""}>
            👤 Add Worker
          </button>
          <button onClick={() => setActiveTab("addProduct")} className={activeTab === "addProduct" ? "active" : ""}>
            📦 Add Product
          </button>
          <button onClick={() => setActiveTab("productList")} className={activeTab === "productList" ? "active" : ""}>
            📋 View Products
          </button>
          <button onClick={() => setActiveTab("updateStatus")} className={activeTab === "updateStatus" ? "active" : ""}>
            📝 Update Status
          </button>
          <button onClick={() => setActiveTab("trackProduct")} className={activeTab === "trackProduct" ? "active" : ""}>
            🔍 Track Product
          </button>
          <button onClick={() => setActiveTab("qrGenerator")} className={activeTab === "qrGenerator" ? "active" : ""}>
            🔲 Generate QR
          </button>
          <button onClick={() => setActiveTab("verification")} className={activeTab === "verification" ? "active" : ""}>
            ✅ Verify Product
          </button>
        </div>

        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
