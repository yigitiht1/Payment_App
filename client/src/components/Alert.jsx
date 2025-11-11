import React from "react";

export default function Alert({ message, type }) {
  return (
    <div style={{
      padding: "10px 20px",
      margin: "10px 0",
      borderRadius: "5px",
      backgroundColor: type === "error" ? "#f44336" : "#4caf50",
      color: "white"
    }}>
      {message}
    </div>
  );
}