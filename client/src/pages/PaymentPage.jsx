import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { payBill } from "../api/api";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bill, user } = location.state || {};

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  if (!bill || !user) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px", color: "#dc3545" }}>
        Ödeme yapılacak fatura bulunamadı!
      </p>
    );
  }

  const handlePay = async () => {
    try {
      await payBill(bill.id);
      alert(`Ödeme başarılı! Tutar: ${bill.amount} ₺`);
      navigate(`/dashboard/${user.abone_no}`, { state: { refreshed: true } });
    } catch (err) {
      console.error("Payment error:", err);
      alert("Ödeme sırasında hata oluştu!");
    }
  };

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, ""); // sadece rakam
    if (val.length > 16) val = val.slice(0, 16);
    setCardNumber(val);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4); // MMYY
    setExpiry(val);
  };

  const handleCvcChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 3) val = val.slice(0, 3);
    setCvc(val);
  };

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "40px auto",
        padding: "25px",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#495057",
          marginBottom: "25px",
        }}
      >
        💳 Fatura Ödeme
      </h2>

      <div
        style={{
          backgroundColor: "#6c5ce7",
          color: "#fff",
          borderRadius: "15px",
          padding: "15px",
          marginBottom: "25px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
        }}
      >
        <p style={{ margin: "4px 0" }}>
          <strong>Tutar:</strong> {bill.amount} ₺
        </p>
        <p style={{ margin: "4px 0" }}>
          <strong>Son Ödeme Tarihi:</strong>{" "}
          {new Date(bill.due_date).toLocaleDateString()}
        </p>
        <p style={{ margin: "4px 0" }}>
          <strong>Durum:</strong>{" "}
          <span style={{ color: bill.is_paid ? "#00b894" : "#fdcb6e" }}>
            {bill.is_paid ? "Ödendi" : "Ödenmedi"}
          </span>
        </p>
      </div>

      {/* Kart Görseli */}
      <div
        style={{
          position: "relative",
          height: "140px",
          borderRadius: "15px",
          background: "linear-gradient(135deg, #00cec9, #0984e3)",
          color: "#fff",
          padding: "15px",
          marginBottom: "25px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
          fontSize: "14px",
        }}
      >
        <div style={{ letterSpacing: "2px", marginBottom: "40px" }}>
          {cardNumber
            ? cardNumber.replace(/\d{4}(?=.)/g, "$& ")
            : "**** **** **** ****"}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            display: "flex",
            justifyContent: "space-between",
            width: "calc(100% - 30px)",
            fontSize: "13px",
          }}
        >
          <span>{expiry ? expiry.replace(/(\d{2})(\d{2})/, "$1/$2") : "MM/YY"}</span>
          <span>CVC: {cvc || "***"}</span>
        </div>
      </div>

      {/* Input Alanları */}
      <div style={{ marginBottom: "20px" }}>
        <label>Kart Numarası</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={handleCardNumberChange}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "5px",
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
            boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)",
          }}
        />

        <div style={{ display: "flex", gap: "10%" }}>
          <div style={{ flex: 1 }}>
            <label>Son Kullanma Tarihi</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={handleExpiryChange}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "5px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "16px",
                boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>CVC</label>
            <input
              type="text"
              placeholder="123"
              value={cvc}
              onChange={handleCvcChange}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "5px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "16px",
                boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handlePay}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "#00b894",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#019875")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#00b894")}
      >
        Öde {bill.amount} ₺
      </button>
    </div>
  );
}