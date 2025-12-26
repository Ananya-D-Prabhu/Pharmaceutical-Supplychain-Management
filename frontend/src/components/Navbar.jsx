export default function Navbar({ children }) {
  return (
    <nav style={{ 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
      color: "#fff", 
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>
        💊 Pharmexis
      </h2>
      {children}
    </nav>
  );
}
