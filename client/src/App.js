import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard/:abone_no"
          element={<Dashboard user={user} setUser={setUser} />}
        />
        <Route path="/payment" element={<PaymentPage user={user} />} />
      </Routes>
    </>
  );
}

export default App;