import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    try {
      const res = await registerUser(name, email);

      if (!res?.data?.abone_no) {
        throw new Error("Backend'den abone_no gelmedi!");
      }

      setAlert({
        message: `Kayıt başarılı! Abone No: ${res.data.abone_no}`,
        type: "success",
      });

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Register error:", err);

      setAlert({
        message: err.response?.data?.detail || err.message || "Kayıt sırasında hata oluştu.",
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
        Register
      </h2>

      {alert && <Alert message={alert.message} type={alert.type} />}

      <form
        onSubmit={handleRegister}
        style={{ display: "flex", flexDirection: "column", gap: "18px" }}
      >
        <input
          type="text"
          placeholder="İsim"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "1rem",
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "1rem",
          }}
        />
        <button
          type="submit"
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
          }}
        >
          {loading ? <Spinner /> : "Kayıt Ol"}
        </button>
      </form>
    </div>
  );
}