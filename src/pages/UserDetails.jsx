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

      console.log(user);

      $(".userDetails").on("click", () => {
        let active = sessionStorage.getItem("isMenuActive");

        if (active == "true") {
          services.handleMenuToggle();
        }
      });

      this.setState({
        user: user,
      });

      $(".loading").hide();
    }
  }

  async handleSubmit() {
    const data = $("form").serializeArray();

    console.log(data);
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
              <Form onSubmit={this.handleSubmit}>
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" value={this.state.user.email} />

                <Form.Label>Telefone</Form.Label>
                <Form.Control type="text" value={this.state.user.phoneNumber} />

                <Form.Label>Blocked</Form.Label>

                <br />

                <Form.Label className="switch">
                  <Form.Control
                    type="checkbox"
                    className="sliderInput"
                    onClick={() => {
                      $(".switch").toggleClass("active");
                      $(".sliderInput").toggleClass("active");
                      $(".slider").toggleClass("active");

                      $(".submitButton").addClass("active");
                    }}
                  />
                  <span className="slider "></span>
                </Form.Label>

                <button type="submit">Salvar</button>
              </Form>
            </div>

            <div className="addressContainer"></div>
          </div>
        </section>
      </main>
    );
  }
}
