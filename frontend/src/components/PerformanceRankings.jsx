import React, { useState, useEffect } from "react";
import axios from "axios";
import WorkerProfile from "./WorkerProfile";
import "./PerformanceRankings.css";

const API_URL = "http://localhost:8000";

export default function PerformanceRankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    minShipments: 0,
    minScore: 0,
  });
  const [showProfile, setShowProfile] = useState(false);
  const [profileWorkerId, setProfileWorkerId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchRankings();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchRankings();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [filters]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      setError("");
      
      const params = {};
      if (filters.role) params.role = filters.role;
      if (filters.minShipments > 0) params.min_shipments = filters.minShipments;
      if (filters.minScore > 0) params.min_score = filters.minScore;

      const response = await axios.get(`${API_URL}/performance/rankings`, { params });
      setRankings(response.data.rankings);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load performance rankings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (workerId) => {
    setProfileWorkerId(workerId);
    setShowProfile(true);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "#10b981";
    if (score >= 75) return "#f59e0b";
    if (score >= 60) return "#f97316";
    return "#ef4444";
  };

  const getMedalEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="performance-rankings">
      <div className="rankings-header">
        <h2>🏆 Performance Rankings</h2>
        <p>Track and compare worker performance across the supply chain</p>
        {lastUpdated && (
          <p className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()} 
            <span className="auto-refresh-indicator"> • Auto-refreshes every 30s</span>
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="rankings-filters">
        <div className="filter-group">
          <label>Role:</label>
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option value="">All Roles</option>
            <option value="MANUFACTURER">Manufacturer</option>
            <option value="DISTRIBUTOR">Distributor</option>
            <option value="TRANSPORTER">Transporter</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Min. Score:</label>
          <select
            value={filters.minScore}
            onChange={(e) =>
              setFilters({ ...filters, minScore: Number(e.target.value) })
            }
          >
            <option value={0}>Any Score</option>
            <option value={60}>60+</option>
            <option value={75}>75+</option>
            <option value={90}>90+</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Min. Shipments:</label>
          <select
            value={filters.minShipments}
            onChange={(e) =>
              setFilters({ ...filters, minShipments: Number(e.target.value) })
            }
          >
            <option value={0}>Any Experience</option>
            <option value={5}>5+</option>
            <option value={10}>10+</option>
            <option value={20}>20+</option>
            <option value={50}>50+</option>
          </select>
        </div>

        <button className="btn-refresh" onClick={fetchRankings}>
          🔄 Refresh
        </button>
      </div>

      {/* Rankings Content */}
      <div className="rankings-content">
        {loading ? (
          <div className="loading-state">
            <span className="spinner"></span>
            <p>Loading rankings...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>❌ {error}</p>
            <button onClick={fetchRankings} className="btn-retry">
              🔄 Retry
            </button>
          </div>
        ) : rankings.length === 0 ? (
          <div className="empty-state">
            <p>📭 No workers found matching criteria</p>
            <p className="empty-subtitle">
              Try adjusting your filter criteria or add more workers to the system
            </p>
          </div>
        ) : rankings.every(w => w.total_shipments === 0) ? (
          <div className="empty-state">
            <div className="info-box">
              <h3>ℹ️ No Activity Data Yet</h3>
              <p>Workers have been registered but haven't handled any products yet.</p>
              <p className="help-text">To see performance data:</p>
              <ol className="help-steps">
                <li>Add products (as Manufacturer)</li>
                <li>Assign products to workers (as Owner/Manufacturer)</li>
                <li>Update product status with temperature readings (as assigned Worker)</li>
              </ol>
              <p className="note">Performance scores are calculated based on successful deliveries and temperature compliance.</p>
            </div>
            
            {/* Still show the workers table with 0 values */}
            <div className="rankings-table">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Worker</th>
                    <th>Role</th>
                    <th>Performance</th>
                    <th>Success Rate</th>
                    <th>Compliance</th>
                    <th>Shipments</th>
                    <th>Spoiled</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((worker, index) => (
                    <tr key={worker.worker_id}>
                      <td className="rank-cell">
                        <span className="rank-badge">{getMedalEmoji(index)}</span>
                      </td>
                      <td className="worker-cell">
                        <div className="worker-info">
                          <span className="worker-icon">
                            {worker.role === "MANUFACTURER" && "🏭"}
                            {worker.role === "DISTRIBUTOR" && "🚚"}
                            {worker.role === "TRANSPORTER" && "✈️"}
                          </span>
                          <div>
                            <div className="worker-name">{worker.name}</div>
                            <div className="worker-id">ID: #{worker.worker_id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="role-badge">{worker.role}</span>
                      </td>
                      <td>
                        <span className="no-data">No data yet</span>
                      </td>
                      <td className="percentage-cell">{worker.success_rate}%</td>
                      <td className="percentage-cell">
                        {worker.temp_compliance_rate}%
                      </td>
                      <td className="number-cell">{worker.total_shipments}</td>
                      <td className="number-cell">
                        {worker.spoiled_shipments}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            <div className="rankings-stats">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-value">{rankings.length}</div>
                <div className="stat-label">Total Workers</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">
                  {rankings.filter((w) => w.performance_score >= 90).length}
                </div>
                <div className="stat-label">Excellent (90+)</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👍</div>
                <div className="stat-value">
                  {
                    rankings.filter(
                      (w) => w.performance_score >= 75 && w.performance_score < 90
                    ).length
                  }
                </div>
                <div className="stat-label">Good (75-89)</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⚠️</div>
                <div className="stat-value">
                  {rankings.filter((w) => w.performance_score < 75).length}
                </div>
                <div className="stat-label">Needs Improvement</div>
              </div>
            </div>

            <div className="rankings-table">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Worker</th>
                    <th>Role</th>
                    <th>Performance</th>
                    <th>Success Rate</th>
                    <th>Compliance</th>
                    <th>Shipments</th>
                    <th>Spoiled</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((worker, index) => (
                    <tr
                      key={worker.worker_id}
                      className={index < 3 ? "top-performer" : ""}
                    >
                      <td className="rank-cell">
                        <span className="rank-badge">{getMedalEmoji(index)}</span>
                      </td>
                      <td className="worker-cell">
                        <div className="worker-info">
                          <span className="worker-icon">
                            {worker.role === "MANUFACTURER" && "🏭"}
                            {worker.role === "DISTRIBUTOR" && "🚚"}
                            {worker.role === "TRANSPORTER" && "✈️"}
                          </span>
                          <div>
                            <div className="worker-name">{worker.name}</div>
                            <div className="worker-id">ID: #{worker.worker_id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="role-badge">{worker.role}</span>
                      </td>
                      <td>
                        <div className="score-cell">
                          <div
                            className="score-bar"
                            style={{
                              width: `${worker.performance_score}%`,
                              backgroundColor: getScoreColor(worker.performance_score),
                            }}
                          ></div>
                          <span className="score-text">
                            {worker.performance_score}
                          </span>
                        </div>
                      </td>
                      <td className="percentage-cell">{worker.success_rate}%</td>
                      <td className="percentage-cell">
                        {worker.temp_compliance_rate}%
                      </td>
                      <td className="number-cell">{worker.total_shipments}</td>
                      <td className={`number-cell ${worker.spoiled_shipments > 0 ? 'warning' : ''}`}>
                        {worker.spoiled_shipments}
                      </td>
                      <td>
                        <button
                          className="btn-view"
                          onClick={() => handleViewProfile(worker.worker_id)}
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
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
