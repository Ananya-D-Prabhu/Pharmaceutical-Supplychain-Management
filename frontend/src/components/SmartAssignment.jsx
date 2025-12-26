import React, { useState, useEffect } from "react";
import axios from "axios";
import WorkerProfile from "./WorkerProfile";
import "./SmartAssignment.css";

const API_URL = "http://localhost:8000";

export default function SmartAssignment({ productId, assignmentType, onAssign, onClose }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    minScore: 0,
    minShipments: 0,
    sortBy: "performance_score" // performance_score, success_rate, total_shipments
  });
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileWorkerId, setProfileWorkerId] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, [productId, assignmentType, filters]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError("");
      
      const role = assignmentType === "distributor" ? "DISTRIBUTOR" : "TRANSPORTER";
      
      const response = await axios.get(
        `${API_URL}/performance/rankings`,
        {
          params: {
            role: role,
            min_score: filters.minScore,
            min_shipments: filters.minShipments
          }
        }
      );
      
      let sortedWorkers = response.data.rankings;
      
      // Apply custom sorting
      if (filters.sortBy === "success_rate") {
        sortedWorkers.sort((a, b) => b.success_rate - a.success_rate);
      } else if (filters.sortBy === "total_shipments") {
        sortedWorkers.sort((a, b) => b.total_shipments - a.total_shipments);
      }
      // performance_score is already sorted by default
      
      setWorkers(sortedWorkers);
    } catch (err) {
      setError("Failed to load worker recommendations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker);
  };

  const handleAssign = () => {
    if (selectedWorker) {
      onAssign(selectedWorker);
    }
  };

  const handleViewProfile = (workerId, e) => {
    e.stopPropagation();
    setProfileWorkerId(workerId);
    setShowProfile(true);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "#10b981"; // Green
    if (score >= 75) return "#f59e0b"; // Yellow
    if (score >= 60) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return "⭐ Excellent";
    if (score >= 75) return "👍 Good";
    if (score >= 60) return "⚠️ Fair";
    return "🚨 Poor";
  };

  return (
    <div className="smart-assignment-overlay" onClick={onClose}>
      <div className="smart-assignment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        {/* Header */}
        <div className="assignment-header">
          <h2>
            {assignmentType === "distributor" ? "🚚" : "✈️"}
            Select {assignmentType === "distributor" ? "Distributor" : "Transporter"}
          </h2>
          <p className="assignment-subtitle">
            Choose based on performance metrics for Product #{productId}
          </p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Minimum Score:</label>
            <select 
              value={filters.minScore}
              onChange={(e) => setFilters({...filters, minScore: Number(e.target.value)})}
            >
              <option value={0}>All Workers</option>
              <option value={60}>60+ (Fair)</option>
              <option value={75}>75+ (Good)</option>
              <option value={90}>90+ (Excellent)</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Minimum Experience:</label>
            <select 
              value={filters.minShipments}
              onChange={(e) => setFilters({...filters, minShipments: Number(e.target.value)})}
            >
              <option value={0}>Any Experience</option>
              <option value={5}>5+ Shipments</option>
              <option value={10}>10+ Shipments</option>
              <option value={20}>20+ Shipments</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By:</label>
            <select 
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
            >
              <option value="performance_score">Performance Score</option>
              <option value="success_rate">Success Rate</option>
              <option value="total_shipments">Experience</option>
            </select>
          </div>
        </div>

        {/* Workers List */}
        <div className="workers-section">
          {loading ? (
            <div className="loading-state">
              <span className="spinner"></span>
              <p>Loading workers...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>❌ {error}</p>
              <button onClick={fetchRecommendations} className="btn-retry">
                🔄 Retry
              </button>
            </div>
          ) : workers.length === 0 ? (
            <div className="empty-state">
              <p>📭 No workers match your filters</p>
              <p className="empty-subtitle">Try adjusting the filter criteria</p>
            </div>
          ) : (
            <div className="workers-list">
              <div className="results-header">
                <span className="results-count">
                  {workers.length} worker{workers.length !== 1 ? 's' : ''} found
                </span>
              </div>
              
              {workers.map((worker, index) => (
                <div 
                  key={worker.worker_id}
                  className={`worker-card ${selectedWorker?.worker_id === worker.worker_id ? 'selected' : ''}`}
                  onClick={() => handleSelectWorker(worker)}
                >
                  <div className="worker-rank">#{index + 1}</div>
                  
                  <div className="worker-main-info">
                    <div className="worker-avatar">
                      {worker.role === "DISTRIBUTOR" && "🚚"}
                      {worker.role === "TRANSPORTER" && "✈️"}
                    </div>
                    
                    <div className="worker-details">
                      <h3>{worker.name}</h3>
                      <p className="worker-meta">
                        ID: #{worker.worker_id} • {worker.total_shipments} shipments
                      </p>
                    </div>
                  </div>

                  <div className="worker-stats">
                    <div className="stat-badge">
                      <div 
                        className="score-indicator"
                        style={{ backgroundColor: getScoreColor(worker.performance_score) }}
                      >
                        {worker.performance_score}
                      </div>
                      <span className="stat-label">{getScoreBadge(worker.performance_score)}</span>
                    </div>

                    <div className="stat-item">
                      <span className="stat-icon">✅</span>
                      <span className="stat-value">{worker.success_rate}%</span>
                      <span className="stat-label">Success</span>
                    </div>

                    <div className="stat-item">
                      <span className="stat-icon">🌡️</span>
                      <span className="stat-value">{worker.temp_compliance_rate}%</span>
                      <span className="stat-label">Compliance</span>
                    </div>

                    {worker.spoiled_shipments > 0 && (
                      <div className="stat-item warning">
                        <span className="stat-icon">❌</span>
                        <span className="stat-value">{worker.spoiled_shipments}</span>
                        <span className="stat-label">Spoiled</span>
                      </div>
                    )}
                  </div>

                  <button 
                    className="btn-view-profile"
                    onClick={(e) => handleViewProfile(worker.worker_id, e)}
                  >
                    👤 View Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="assignment-footer">
          {selectedWorker ? (
            <div className="selection-info">
              <span>Selected: <strong>{selectedWorker.name}</strong></span>
              <span className="selection-score">
                Score: {selectedWorker.performance_score}
              </span>
            </div>
          ) : (
            <div className="selection-info">
              <span>Select a worker to continue</span>
            </div>
          )}
          
          <div className="action-buttons">
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn-assign"
              disabled={!selectedWorker}
              onClick={handleAssign}
            >
              ✓ Assign Selected Worker
            </button>
          </div>
        </div>
      </div>

      {/* Worker Profile Modal */}
      {showProfile && (
        <WorkerProfile 
          workerId={profileWorkerId}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}
