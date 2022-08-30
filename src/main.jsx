import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import PowerBi from "./pages/PowerBi";
import Register from "./pages/Register";
import Restaurants from "./pages/Restaurants";
import Users from "./pages/Users";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/powerBi" element={<PowerBi />} />
      <Route path="/restaurantes" element={<Restaurants />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  </HashRouter>
);
