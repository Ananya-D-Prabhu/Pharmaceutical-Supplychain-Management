import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WorkerProfile.css";

const API_URL = "http://localhost:8000";

export default function WorkerProfile({ workerId, onClose }) {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentOnly, setRecentOnly] = useState(false);

  useEffect(() => {
    if (workerId !== null && workerId !== undefined) {
      fetchPerformance();
    }
  }, [workerId, recentOnly]);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${API_URL}/performance/worker/${workerId}?recent_only=${recentOnly}&limit=50`
      );
      setPerformance(response.data);
    } catch (err) {
      setError("Failed to load performance data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "#10b981"; // Green
    if (score >= 75) return "#f59e0b"; // Yellow
    if (score >= 60) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  if (loading) {
    return (
      <div className="worker-profile-overlay">
        <div className="worker-profile-modal">
          <div className="loading-state">
            <span className="spinner"></span>
            <p>Loading performance data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !performance) {
    return (
      <div className="worker-profile-overlay">
        <div className="worker-profile-modal">
          <button className="close-btn" onClick={onClose}>✕</button>
          <div className="error-state">
            <p>❌ {error || "No data available"}</p>
            <button onClick={fetchPerformance} className="btn-retry">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="worker-profile-overlay" onClick={onClose}>
      <div className="worker-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {performance.worker_role === "MANUFACTURER" && "🏭"}
            {performance.worker_role === "DISTRIBUTOR" && "🚚"}
            {performance.worker_role === "TRANSPORTER" && "✈️"}
          </div>
          <div className="profile-info">
            <h2>{performance.worker_name}</h2>
            <p className="role-badge">{performance.worker_role}</p>
            <p className="worker-id">Worker ID: #{performance.worker_id}</p>
          </div>
        </div>

        {/* Performance Score */}
        <div className="score-section">
          <div 
            className="score-circle"
            style={{ borderColor: getScoreColor(performance.performance_score) }}
          >
            <div className="score-value">
              {performance.performance_score}
            </div>
            <div className="score-label">
              {getScoreLabel(performance.performance_score)}
            </div>
          </div>
        </div>

        {/* Toggle for Recent/All Time */}
        <div className="toggle-section">
          <button 
            className={`toggle-btn ${!recentOnly ? 'active' : ''}`}
            onClick={() => setRecentOnly(false)}
          >
            All Time
          </button>
          <button 
            className={`toggle-btn ${recentOnly ? 'active' : ''}`}
            onClick={() => setRecentOnly(true)}
          >
            Recent (Last 50 checks)
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📦</div>
            <div className="metric-value">{performance.total_shipments_handled}</div>
            <div className="metric-label">Total Shipments</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">✅</div>
            <div className="metric-value">{performance.successful_shipments}</div>
            <div className="metric-label">Successful</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">❌</div>
            <div className="metric-value">{performance.spoiled_shipments}</div>
            <div className="metric-label">Spoiled</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🎯</div>
            <div className="metric-value">{performance.success_rate}%</div>
            <div className="metric-label">Success Rate</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🌡️</div>
            <div className="metric-value">{performance.total_temp_checks}</div>
            <div className="metric-label">Temp Checks</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⚠️</div>
            <div className="metric-value">{performance.out_of_range_readings}</div>
            <div className="metric-label">Violations</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-value">{performance.temp_compliance_rate}%</div>
            <div className="metric-label">Compliance Rate</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📋</div>
            <div className="metric-value">{performance.products_handled.length}</div>
            <div className="metric-label">Products Handled</div>
          </div>
        </div>

        {/* Recent Temperature Records */}
        {performance.recent_temperatures && performance.recent_temperatures.length > 0 && (
          <div className="temp-history-section">
            <h3>📈 Recent Temperature Records</h3>
            <div className="temp-records">
              {performance.recent_temperatures.map((record, idx) => {
                const isCompliant = record.temp_in_range && record.humidity_in_range;
                return (
                  <div 
                    key={idx} 
                    className={`temp-record ${isCompliant ? 'in-range' : 'out-of-range'}`}
                  >
                    <div className="record-product">Product #{record.product_id}</div>
                    <div className="record-readings">
                      <div className="reading-item">
                        <span className="reading-label">🌡️ Temp:</span>
                        <span className={`reading-value ${record.temp_in_range ? '' : 'violation'}`}>
                          {record.temperature}°C
                        </span>
                        <span className="temp-range">
                          ({record.min_temp}°C - {record.max_temp}°C)
                        </span>
                        {!record.temp_in_range && <span className="violation-badge">⚠️</span>}
                      </div>
                      <div className="reading-item">
                        <span className="reading-label">💧 Humidity:</span>
                        <span className={`reading-value ${record.humidity_in_range ? '' : 'violation'}`}>
                          {record.humidity}%
                        </span>
                        <span className="temp-range">
                          ({record.min_humidity}% - {record.max_humidity}%)
                        </span>
                        {!record.humidity_in_range && <span className="violation-badge">⚠️</span>}
                      </div>
                    </div>
                    <div className="record-status">
                      {isCompliant ? '✅ Compliant' : '❌ Violated'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Performance Insights */}
        <div className="insights-section">
          <h3>💡 Performance Insights</h3>
          <div className="insights">
            {performance.performance_score >= 90 && (
              <div className="insight success">
                ⭐ Exceptional performer! This worker maintains excellent temperature control and has high success rate.
              </div>
            )}
            {performance.performance_score >= 75 && performance.performance_score < 90 && (
              <div className="insight good">
                👍 Reliable worker with good track record. Suitable for most shipments.
              </div>
            )}
            {performance.performance_score >= 60 && performance.performance_score < 75 && (
              <div className="insight warning">
                ⚠️ Acceptable performance but room for improvement. Consider for less sensitive shipments.
              </div>
            )}
            {performance.performance_score < 60 && (
              <div className="insight danger">
                🚨 Performance needs significant improvement. Additional training or monitoring recommended.
              </div>
            )}
            
            {performance.temp_compliance_rate < 80 && (
              <div className="insight warning">
                🌡️ Temperature compliance is below optimal. Review temperature monitoring procedures.
              </div>
            )}
            
            {performance.total_shipments_handled < 5 && (
              <div className="insight info">
                ℹ️ Limited experience. Performance data may not be fully representative yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
