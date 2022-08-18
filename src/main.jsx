import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import PowerBi from "./pages/PowerBi";
import Register from "./pages/Register";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/powerBi" element={<PowerBi />} />
    </Routes>
  </HashRouter>
);
