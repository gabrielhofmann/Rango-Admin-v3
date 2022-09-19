import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import Coupons from "./pages/Coupons";
import Login from "./pages/Login";
import Mailing from "./pages/Mailing";
import OneSignal from "./pages/OneSignal";
import PowerBi from "./pages/PowerBi";
import Register from "./pages/Register";
import RestaurantDetails from "./pages/RestaurantDetails";
import Restaurants from "./pages/Restaurants";
import UserDetails from "./pages/UserDetails";
import Users from "./pages/Users";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/powerBi" element={<PowerBi />} />
      <Route path="/restaurantes" element={<Restaurants />} />
      <Route path="/detalhesRestaurante" element={<RestaurantDetails />} />
      <Route path="/usuarios" element={<Users />} />
      <Route path="/detalhesUsuario" element={<UserDetails />} />
      <Route path="/cupons" element={<Coupons />} />
      <Route path="/mailing" element={<Mailing />} />
      <Route path="/onesignal" element={<OneSignal />} />
    </Routes>
  </HashRouter>
);
