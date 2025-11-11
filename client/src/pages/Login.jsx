import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

export default function Login({ setUser }) {
  const [aboneNo, setAboneNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!aboneNo) {
      setAlert({ message: "Abone numarası boş olamaz", type: "error" });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const res = await loginUser(aboneNo);

      if (!res?.data?.abone_no) {
        throw new Error("Backend'den abone_no gelmedi!");
      }

      setUser(res.data); // user state'i set ediliyor
      navigate(`/dashboard/${res.data.abone_no}`);
    } catch (err) {
      console.error("Login error:", err);
      setAlert({
        message: err.response?.data?.detail || err.message || "Abone numarası bulunamadı!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "70px auto",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        backgroundColor: "#ffffff",
        transition: "0.3s",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
          fontSize: "1.8rem",
          color: "#1976d2",
          fontWeight: "bold",
        }}
      >
        Login
      </h2>

      {alert && <Alert message={alert.message} type={alert.type} />}

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <input
          placeholder="Abone No"
          value={aboneNo}
          onChange={(e) => setAboneNo(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "1rem",
            transition: "0.3s",
          }}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#1976d2",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "0.3s",
          }}
        >
          {loading ? <Spinner /> : "Login"}
        </button>
      </div>
    </div>
  );
}