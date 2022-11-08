import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
import Menu from "../components/Menu";
import { Services } from "../services";
import $ from "jquery";
import "jquery-mask-plugin";

import "./Users.scss";
import Pagination from "../components/Pagination";
import Filter from "../components/Filter";

const services = new Services();

export default class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };

    this.setUsers = this.setUsers.bind(this);
  }

  async componentDidMount() {
    sessionStorage.setItem("isMenuActive", false);
    const token = sessionStorage.getItem("token");

    if (!token) {
      $(".users").html("Not Authorized!!");
    } else {
      $(".loading").show();

      const users = await services.getUsers(0);

      $(".users").on("click", () => {
        let active = sessionStorage.getItem("isMenuActive");

        if (active == "true") {
          services.handleMenuToggle();
        }
      });

      $(".cpf").mask("000.000.000-00");

      this.setState({ users: users.users });

      $(".loading").hide();
    }
  }

  setUsers = (results) => {
    this.setState({ users: results });
  };

  render() {
    return (
      <main className="users">
        <Menu />

        <div className="loading">
          <Spinner className="spinner" animation="border" />
        </div>

        <div className="pageHeader">
          <div className="menuToggle" onClick={services.handleMenuToggle}>
            <span className="material-symbols-rounded">menu</span>
          </div>

          <div className="pageTitle">
            <h1>Usuários</h1>
            <span className="material-symbols-rounded">person</span>
          </div>
        </div>

        <Pagination target="users" callback={this.setUsers} />

        <section className="pageContainer usersContainer">
          <div className="usersFilter">
            <p
              onClick={() => {
                window.location.reload();
              }}
            >
              Limpar
            </p>

            <Filter target="users" callback={this.setUsers} />
          </div>

          <div className="userCardsContainer">
            <strong>ID</strong>
            <strong>Nome</strong>
            <strong>E-mail</strong>
            <strong>Telefone</strong>
            <strong>CPF</strong>
            <strong>Role</strong>
            <strong>Bloqueado</strong>
            <strong>Confirmado</strong>

            {this.state.users.map((user) => {
              return (
                <div className="userCard">
                  <strong>#ID {user.id}</strong>
                  <strong>{user.username}</strong>
                  <strong>{user.email}</strong>
                  <strong>{user.phoneNumber}</strong>
                  <strong>{user.cpf}</strong>
                  {/* <strong>{user.role.name}</strong> */}
                  <strong>{user.blocked ? "SIM" : "NÃO"}</strong>
                  <strong>{user.confirmed ? "SIM" : "NÃO"}</strong>
                  <button
                    onClick={() => {
                      sessionStorage.setItem("userId", user.id);
                      window.location.href = "/#/detalhesUsuario";
                    }}
                  >
                    Ver mais
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    );
  }
}
