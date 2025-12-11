import React, { useState } from "react";

export default function ProductStatus() {
  const [id, setId] = useState("");
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStatus = async () => {
    if (!id) {
      alert("Please enter a product ID");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(`http://localhost:8000/products/history/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Failed to load status");
        alert("Error: " + (data.error || "Failed to load status"));
        return;
      }
      
      setStatus(data);
      if (data.length === 0) {
        alert("No status updates found for this product");
      }
    } catch (error) {
      console.error("Error loading status:", error);
      setError(error.message);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>Track Product Status</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <input
        type="number"
        placeholder="Enter Product ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        disabled={loading}
      />
      <button onClick={loadStatus} disabled={loading}>
        {loading ? "Loading..." : "View Status"}
      </button>

      {status.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          {status.map((s, i) => (
            <div key={i} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
              <p><strong>Location:</strong> {s.location}</p>
              <p><strong>Temperature:</strong> {s.temperature}</p>
              <p><strong>Humidity:</strong> {s.humidity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
