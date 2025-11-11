import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const linkStyle = (path) => ({
    color: "white",
    padding: "8px 14px",
    borderRadius: "8px",
    backgroundColor: location.pathname === path ? "rgba(255,255,255,0.2)" : "transparent",
    textDecoration: "none",
    fontWeight: location.pathname === path ? "bold" : "normal",
    transition: "0.3s",
  });

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 25px",
        background: "linear-gradient(90deg, #1976d2, #42a5f5)",
        color: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        borderRadius: "0 0 15px 15px",
      }}
    >
      <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", letterSpacing: "1px" }}>
        PaymentApp
      </h1>
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {!user ? (
          <>
            <Link to="/" style={linkStyle("/")}>Login</Link>
            <Link to="/register" style={linkStyle("/register")}>Register</Link>
          </>
        ) : (
          <>
            <span style={{ fontWeight: "bold" }}>{user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "white",
                color: "#1976d2",
                fontWeight: "bold",
                transition: "0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#e0e0e0")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}