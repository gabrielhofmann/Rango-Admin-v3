import React, { Component } from "react";
import { Form, Spinner } from "react-bootstrap";
import Menu from "../components/Menu";
import { Services } from "../services";
import $ from "jquery";

import "./UserDetails.scss";

const services = new Services();

export default class UserDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      role: "",
      isChanged: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    sessionStorage.setItem("isMenuActive", false);
    const token = sessionStorage.getItem("token");
    $(".loading").show();

    if (!token) {
      $(".loading").hide();
      $(".coupons").html("Not Authorized!!");
    } else {
      const userId = sessionStorage.getItem("userId");

      const user = await services.findUser(userId);

      $(".userDetails").on("click", () => {
        let active = sessionStorage.getItem("isMenuActive");

        if (active == "true") {
          services.handleMenuToggle();
        }
      });

      $("#phone").mask("(00) 00000-0000")

      this.setState({
        user: user,
        role: user.role.name,
      });

      $(".loading").hide();
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    $(".loading").show();

    const email = $("#email");
    const phone = $("#phone");
    const blocked = $("#blocked")[0].checked;

    const body = {
      email: email[0].value,
      phoneNumber: phone[0].value,
      blocked: blocked,
    };

    await services.updateUser(this.state.user.id, body);

    $(".loading").hide();

    window.location.reload();
  }

  render() {
    return (
      <main className="userDetails">
        <Menu />

        <div className="loading">
          <Spinner className="spinner" animation="border" />
        </div>

        <div className="pageHeader">
          <div className="menuToggle" onClick={services.handleMenuToggle}>
            <span className="material-symbols-rounded">menu</span>
          </div>

          <div className="pageTitle">
            <h1>Detalhes Usuário</h1>
            <span className="material-symbols-rounded">person</span>
          </div>
        </div>

        <section className="userDetailsContainer">
          <div className="gridContainer">
            <div className="notEditableContainer">
              <ul>
                <li key="userName">
                  <strong>Nome</strong>
                  <span>{this.state.user.username}</span>
                </li>

                <li key="userId">
                  <strong>ID</strong>
                  <span>#ID {this.state.user.id}</span>
                </li>

                <li key="userRole">
                  <strong>Role</strong>
                  <span>{this.state.role}</span>
                </li>

                <li key="userCPF">
                  <strong>CPF</strong>
                  <span>{this.state.user.cpf}</span>
                </li>

                <li key="userOneSignal">
                  <strong>One Signal</strong>
                  <span>{this.state.user.oneSignalId}</span>
                </li>
              </ul>
            </div>

            <div className="editableContainer">
              <Form
                onSubmit={(e) => {
                  this.handleSubmit(e);
                }}
              >
                <Form.Label>Email</Form.Label>
                <Form.Control
                  id="email"
                  type="text"
                  defaultValue={this.state.user.email}
                  onChange={
                    this.state.isChanged == false
                      ? () => {
                          $("#submitButton").show();

                          this.setState({ isChanged: true });
                        }
                      : null
                  }
                />

                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  id="phone"
                  defaultValue={this.state.user.phoneNumber}
                  type="text"
                  onChange={
                    this.state.isChanged == false
                      ? () => {
                          $("#submitButton").show();

                          this.setState({ isChanged: true });
                        }
                      : null
                  }
                />

                <Form.Label style={{ marginLeft: "1rem" }}>Blocked</Form.Label>

                <br />

                <Form.Label className="switch">
                  <Form.Control
                    id="blocked"
                    type="checkbox"
                    className="sliderInput"
                    onClick={() => {
                      $(".switch").toggleClass("active");
                      $(".sliderInput").toggleClass("active");
                      $(".slider").toggleClass("active");

                      $("#submitButton").show();
                    }}
                  />
                  <span className="slider "></span>
                </Form.Label>

                <button id="submitButton" type="submit">
                  Salvar
                </button>
              </Form>
            </div>

            <div className="addressContainer"></div>
          </div>
        </section>
      </main>
    );
  }
}
