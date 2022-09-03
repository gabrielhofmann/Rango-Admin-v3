import React from "react";
import $ from "jquery";

import logo from "../assets/logo.svg";
import { Services } from "../services";
import "./Menu.scss";

const services = new Services();

export default function Menu() {
  $("#menuClose").on("click", () => {
    let active = sessionStorage.getItem("isMenuActive");

    if (active == "true") {
      services.handleMenuToggle();
    }
  });

  return (
    <main className="menu">
      <section className="header">
        <img src={logo} alt="Logo" />

        <span>Admin</span>

        <span id="menuClose" className="material-symbols-rounded">
          close
        </span>
      </section>

      <nav className="menuNav">
        <ul>
          <li>
            <a href="/#/powerBi">
              <span className="material-symbols-rounded">monitoring</span>

              <p>Power BI</p>
            </a>
          </li>

          <li>
            <a href="/#/restaurantes">
              <span className="material-symbols-rounded">store</span>

              <p>Restaurantes</p>
            </a>
          </li>

          <li>
            <a href="/#/usuarios">
              <span className="material-symbols-rounded">person</span>

              <p>Usuários</p>
            </a>
          </li>

          <li>
            <a href="">
              <span className="material-symbols-rounded">list_alt</span>

              <p>Pedidos</p>
            </a>
          </li>

          <li>
            <a href="">
              <span className="material-symbols-rounded">sell</span>

              <p>Cupons</p>
            </a>
          </li>

          <li>
            <a href="">
              <span className="material-symbols-rounded">web_asset</span>

              <p>Conteúdos</p>
            </a>
          </li>

          <li>
            <a href="">
              <span className="material-symbols-rounded">group</span>

              <p>Suporte</p>
            </a>
          </li>

          <li>
            <a href="">
              <span className="material-symbols-rounded">
                radio_button_checked
              </span>

              <p>One Signal</p>
            </a>
          </li>

          <li>
            <a href="">
              <span className="material-symbols-rounded logout">logout</span>

              <p>Sair</p>
            </a>
          </li>
        </ul>
      </nav>
    </main>
  );
}
