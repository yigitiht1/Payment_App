import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getBills, loginUser } from "../api/api";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import { FaClipboardList, FaMoneyCheckAlt } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard({ user, setUser }) {
  const { abone_no } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user && abone_no) {
      fetchUser();
    } else if (user) {
      fetchBills();
    }
  }, [filter, user]);

  useEffect(() => {
    if (location.state?.refreshed && user) {
      fetchBills();
    }
  }, [location.state]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await loginUser(abone_no);
      if (!res?.data?.id) throw new Error("Kullanıcı bilgisi alınamadı");
      setUser(res.data);
      fetchBills(res.data.id);
    } catch (err) {
      console.error("User fetch error:", err);
      setAlert({ message: "Kullanıcı yüklenemedi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchBills = async (userId) => {
    const id = userId || user?.id;
    if (!id) return;
    setLoading(true);
    try {
      const res = await getBills(id);
      let data = res.data;
      if (filter === "paid") data = data.filter((b) => b.is_paid);
      if (filter === "unpaid") data = data.filter((b) => !b.is_paid);
      data.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
      setBills(data);
    } catch (err) {
      console.error("Fetch bills error:", err.response?.data || err.message);
      setAlert({
        message: err.response?.data?.detail || "Faturalar yüklenemedi",
        type: "error",
      });
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const goToPayment = (bill) => {
    navigate("/payment", { state: { bill, user } });
  };

  const totalDebt = bills
    .filter((b) => !b.is_paid)
    .reduce((a, b) => a + b.amount, 0);
  const totalPaid = bills
    .filter((b) => b.is_paid)
    .reduce((a, b) => a + b.amount, 0);

  const chartData = [
    { name: "Paid", value: totalPaid },
    { name: "Unpaid", value: totalDebt },
  ];
  const COLORS = ["#28a745", "#dc3545"];

  const copyAboneNo = () => {
    navigator.clipboard.writeText(user.abone_no);
    setAlert({ message: "Abone No kopyalandı!", type: "success" });
    setTimeout(() => setAlert(null), 2000);
  };

  const filterButtonStyle = (type) => ({
    padding: "8px 16px",
    marginRight: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: filter === type ? "#007bff" : "#e0e0e0",
    color: filter === type ? "#fff" : "#333",
    transition: "0.3s",
  });

  return (
    <div style={{ maxWidth: "900px", margin: "50px auto", padding: "0 20px" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center", color: "#007bff" }}>
        Dashboard
      </h2>

      {/* Kullanıcı Bilgi Kartı */}
      {user && (
        <div
          style={{
            background: "linear-gradient(90deg, #007bff, #00c6ff)",
            color: "#fff",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "30px",
            textAlign: "center",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          }}
        >
          <h2 style={{ margin: 0 }}>{user.name}</h2>
          <p style={{ margin: "5px 0" }}>{user.email}</p>
          <p
            onClick={copyAboneNo}
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "bold",
              color: "#fff",
              marginTop: "8px",
            }}
          >
            Abone No: {user.abone_no}
          </p>
        </div>
      )}

      {alert && <Alert message={alert.message} type={alert.type} />}

      {/* Filtre Butonları */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button style={filterButtonStyle("all")} onClick={() => setFilter("all")}>
          All
        </button>
        <button style={filterButtonStyle("paid")} onClick={() => setFilter("paid")}>
          Paid
        </button>
        <button
          style={filterButtonStyle("unpaid")}
          onClick={() => setFilter("unpaid")}
        >
          Unpaid
        </button>
      </div>

      {/* Toplam Bilgi Kartları */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* Total Paid */}
        <div
          style={{
            background: "linear-gradient(135deg, #28a745, #218838)",
            color: "#fff",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            textAlign: "center",
          }}
        >
          <FaMoneyCheckAlt size={24} />
          <h4 style={{ margin: "10px 0 5px" }}>Toplam Ödenen</h4>
          <p style={{ fontWeight: "bold", fontSize: "18px" }}>{totalPaid} ₺</p>
        </div>

        {/* Total Debt */}
        <div
          style={{
            background: "linear-gradient(135deg, #dc3545, #c82333)",
            color: "#fff",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            textAlign: "center",
          }}
        >
          <FaClipboardList size={24} />
          <h4 style={{ margin: "10px 0 5px" }}>Toplam Borç</h4>
          <p style={{ fontWeight: "bold", fontSize: "18px" }}>{totalDebt} ₺</p>
        </div>
      </div>

      {/* Grafik (PieChart) */}
      <div
        style={{
          width: "100%",
          height: 300,
          marginTop: "20px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          padding: "20px",
        }}
      >
        <h3 style={{ textAlign: "center", color: "#007bff" }}>Fatura Dağılımı</h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value} ₺`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Fatura Listesi */}
      {loading ? (
        <Spinner />
      ) : bills.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777", marginTop: "30px" }}>
          Fatura bulunamadı.
        </p>
      ) : (
        bills.map((b) => (
          <div
            key={b.id}
            style={{
              padding: "20px",
              margin: "12px 0",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#fff",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              transition: "0.3s",
            }}
          >
            <div style={{ flex: 1 }}>
              <p>
                <strong>Tutar:</strong> {b.amount} ₺
              </p>
              <p>
                <strong>Son ödeme tarihi:</strong>{" "}
                {new Date(b.due_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Durum:</strong>{" "}
                <span style={{ color: b.is_paid ? "green" : "red" }}>
                  {b.is_paid ? "Paid" : "Unpaid"}
                </span>
              </p>
            </div>
            {!b.is_paid && (
              <button
                onClick={() => goToPayment(b)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Pay
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}