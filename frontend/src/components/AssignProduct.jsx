import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import SmartAssignment from "./SmartAssignment";
import contractABI from "../contractConfig";
import "./AssignProduct.css";
import "./SuccessModal.css";

const API_URL = "http://localhost:8000";
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function AssignProduct() {
  const [productId, setProductId] = useState("");
  const [assignmentType, setAssignmentType] = useState("distributor");
  const [showAssignment, setShowAssignment] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [assignedWorkerInfo, setAssignedWorkerInfo] = useState(null);

  const handleOpenAssignment = () => {
    if (!productId) {
      setMessage("Please enter a product ID");
      setIsError(true);
      return;
    }
    setShowAssignment(true);
    setMessage("");
  };

  const handleAssignment = async (worker) => {
    try {
      setSelectedWorker(worker);
      setShowAssignment(false);
      setMessage("⏳ Assigning worker to product...");
      setIsError(false);
      
      // Call smart contract to transfer ownership (assign worker)
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      // Transfer ownership to the selected worker
      const tx = await contract.transferOwnership(
        parseInt(productId),
        worker.worker_id
      );
      
      setMessage("⏳ Transaction submitted! Waiting for confirmation...");
      const receipt = await tx.wait();
      
      setTxHash(receipt.hash);
      setAssignedWorkerInfo({
        name: worker.name,
        id: worker.worker_id,
        role: assignmentType,
        productId: productId,
        performanceScore: worker.performance_score,
        successRate: worker.success_rate,
        complianceRate: worker.temp_compliance_rate
      });
      setShowModal(true);
      setMessage("");
      
      // Clear form after modal is shown
      setTimeout(() => {
        setProductId("");
        setSelectedWorker(null);
      }, 500);
      
    } catch (error) {
      console.error("Assignment error:", error);
      setMessage("❌ Failed to assign worker: " + (error.reason || error.message));
      setIsError(true);
    }
  };

  return (
    <div className="assign-product">
      <div className="assign-header">
        <h2>🎯 Smart Worker Assignment</h2>
        <p>Assign distributors and transporters based on performance metrics</p>
      </div>

      <div className="assign-form">
        <div className="form-group">
          <label>Product ID:</label>
          <input
            type="number"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID"
            min="0"
          />
          <small>Enter the ID of the product you want to assign</small>
        </div>

        <div className="form-group">
          <label>Assignment Type:</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                value="distributor"
                checked={assignmentType === "distributor"}
                onChange={(e) => setAssignmentType(e.target.value)}
              />
              <span className="radio-label">
                <span className="radio-icon">🚚</span>
                <span>Distributor</span>
                <small>Handles storage and distribution</small>
              </span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                value="transporter"
                checked={assignmentType === "transporter"}
                onChange={(e) => setAssignmentType(e.target.value)}
              />
              <span className="radio-label">
                <span className="radio-icon">✈️</span>
                <span>Transporter</span>
                <small>Handles transportation and delivery</small>
              </span>
            </label>
          </div>
        </div>

        <button className="btn-select-worker" onClick={handleOpenAssignment}>
          🔍 Select Best {assignmentType === "distributor" ? "Distributor" : "Transporter"}
        </button>

        {message && (
          <div className={`message ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}

        {selectedWorker && (
          <div className="selected-worker-card">
            <h3>✅ Assigned Worker</h3>
            <div className="worker-details">
              <div className="worker-avatar">
                {selectedWorker.role === "DISTRIBUTOR" ? "🚚" : "✈️"}
              </div>
              <div className="worker-info">
                <h4>{selectedWorker.name}</h4>
                <p>ID: #{selectedWorker.worker_id}</p>
                <p className="worker-role">{selectedWorker.role}</p>
              </div>
              <div className="worker-metrics">
                <div className="metric">
                  <span className="metric-label">Performance</span>
                  <span className="metric-value">{selectedWorker.performance_score}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Success Rate</span>
                  <span className="metric-value">{selectedWorker.success_rate}%</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Compliance</span>
                  <span className="metric-value">{selectedWorker.temp_compliance_rate}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="info-section">
        <h3>💡 How Smart Assignment Works</h3>
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">📊</div>
            <h4>Performance Scoring</h4>
            <p>Workers are ranked based on their historical performance, including success rate and temperature compliance.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🎯</div>
            <h4>Smart Filtering</h4>
            <p>Filter workers by minimum performance score, experience level, and specific role requirements.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">✅</div>
            <h4>Data-Driven Decisions</h4>
            <p>Make informed decisions based on real-time performance metrics tracked on the blockchain.</p>
          </div>
        </div>
      </div>

      {/* Smart Assignment Modal */}
      {showAssignment && (
        <SmartAssignment
          productId={Number(productId)}
          assignmentType={assignmentType}
          onAssign={handleAssignment}
          onClose={() => setShowAssignment(false)}
        />
      )}

      {/* Success Modal */}
      {showModal && assignedWorkerInfo && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="success-icon">✅</div>
              <h3>Worker Assigned Successfully!</h3>
            </div>
            <div className="modal-body">
              <p className="modal-message">Product has been assigned to worker</p>
              
              <div className="assignment-details">
                <div className="detail-row">
                  <span className="detail-label">📦 Product ID:</span>
                  <span className="detail-value">#{assignedWorkerInfo.productId}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">👤 Worker Name:</span>
                  <span className="detail-value">{assignedWorkerInfo.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🆔 Worker ID:</span>
                  <span className="detail-value">#{assignedWorkerInfo.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">💼 Role:</span>
                  <span className="detail-value">{assignedWorkerInfo.role.toUpperCase()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">⭐ Performance Score:</span>
                  <span className="detail-value score">{assignedWorkerInfo.performanceScore}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">✅ Success Rate:</span>
                  <span className="detail-value">{assignedWorkerInfo.successRate}%</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🌡️ Compliance:</span>
                  <span className="detail-value">{assignedWorkerInfo.complianceRate}%</span>
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
