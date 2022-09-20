import React, { Component } from "react";
import { Form, Spinner } from "react-bootstrap";
import Menu from "../components/Menu";
import { Services } from "../services";
import $ from "jquery";
import logo from "../assets/logo.svg";

import "./RestaurantDetails.scss";

const services = new Services();

export default class RestaurantDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurant: {},
      billing: {},
      acquirer: {},
      legal: {},
      timing: [],
      totalRestaurantOrders: 0,
    };

    this.createsubAccount = this.createsubAccount.bind(this);
  }

  async componentDidMount() {
    sessionStorage.setItem("isMenuActive", false);
    const token = sessionStorage.getItem("token");

    if (!token) {
      $(".restaurantDetails").html("Not Authorized!!");
    } else {
      $(".loading").show();

      const restaurant = await services.findRestaurant(
        sessionStorage.getItem("restaurantId")
      );

      console.log(restaurant);

      const data = await services.getPowerBiData();

      console.log(restaurant);

      data.ordersPerRestaurant.forEach((e) => {
        if (e.restaurant.name == restaurant.name) {
          this.setState({ totalRestaurantOrders: e.orders });
        }
      });

      $(".restaurantDetails").on("click", () => {
        let active = sessionStorage.getItem("isMenuActive");

        if (active == "true") {
          services.handleMenuToggle();
        }
      });

      this.setState({
        restaurant: restaurant,
        billing: restaurant.billing,
        acquirer: restaurant.acqurier,
        legal: restaurant.legal,
        timing: restaurant.timing,
      });

      $(".loading").hide();
    }
  }

  async createsubAccount() {
    $(".loading").show();

    const id = this.state.restaurant.id;
    const data = $("#subaccountForm").serializeArray();

    let body = {};

    data.map((el) => {
      body[el.name] = el.value;
    });

    const response = await services.createSubaccount(body, id);

    $(".loading").hide();
  }

  render() {
    return (
      <main className="restaurantDetails">
        <Menu />

        <div className="loading">
          <Spinner className="spinner" animation="border" />
        </div>

        <div className="pageHeader">
          <div className="menuToggle" onClick={services.handleMenuToggle}>
            <span className="material-symbols-rounded">menu</span>
          </div>

          <div className="pageTitle">
            <h1>{this.state.restaurant.name}</h1>
            <span className="material-symbols-rounded">store</span>
          </div>
        </div>

        <section className="restaurantDetailsContainer">
          <div className="restaurantDetailsHeader">
            <div className="nameAndImage">
              <div
                className="image"
                style={{
                  backgroundImage: `url(${
                    this.state.restaurant.thumbnailImageUrl
                      ? this.state.restaurant.thumbnailImageUrl
                      : logo
                  })`,
                }}
              ></div>

              <strong>
                <span>#ID {this.state.restaurant.id}</span>
                <br />
                {this.state.restaurant.name}
              </strong>
            </div>

            <div className="restaurantDetailsRow">
              {this.state.restaurant.status == "criado" ? (
                <div className="rowContent">
                  <div className="status">
                    <strong>
                      {this.state.restaurant.status.toUpperCase()}
                    </strong>
                  </div>

                  <button
                    className="sendToAnalysis"
                    onClick={() => {
                      $(".loading").show();

                      services.updateRestaurantStatus(
                        this.state.restaurant.id,
                        "pendente"
                      );

                      $(".loading").hide();

                      window.location.reload();
                    }}
                  >
                    Enviar para análise
                  </button>
                </div>
              ) : this.state.restaurant.status == "pendente" ? (
                <div className="rowContent">
                  <div className="status">
                    <strong>
                      {this.state.restaurant.status.toUpperCase()}
                    </strong>
                  </div>

                  <button
                    className="confirm actionButton"
                    onClick={() => {
                      $(".loading").show();

                      services.updateRestaurantStatus(
                        this.state.restaurant.id,
                        "confirmado"
                      );

                      $(".loading").hide();

                      window.location.reload();
                    }}
                  >
                    CONFIRMAR
                  </button>

                  <button
                    className="refuse actionButton"
                    onClick={() => {
                      $(".loading").show();

                      services.updateRestaurantStatus(
                        this.state.restaurant.id,
                        "recusado"
                      );

                      $(".loading").hide();

                      window.location.reload();
                    }}
                  >
                    RECUSAR
                  </button>
                </div>
              ) : this.state.restaurant.status == "operando" ? (
                <div className="rowContent">
                  <div className="status">
                    <strong style={{ color: "#52E899" }}>
                      {this.state.restaurant.status.toUpperCase()}
                    </strong>
                  </div>

                  <div className="rating">
                    <div className="icons">
                      {this.state.restaurant.rating > 0 ? (
                        () => {
                          for (
                            var i = 0;
                            i < this.state.restaurant.rating;
                            i++
                          ) {
                            return (
                              <span className="material-symbols-rounded restaurantIcon">
                                star
                              </span>
                            );
                          }
                        }
                      ) : (
                        <span className="material-symbols-rounded restaurantIcon">
                          star
                        </span>
                      )}
                    </div>

                    <p>Avaliação</p>
                  </div>

                  <div className="orders">
                    <strong>{this.state.totalRestaurantOrders}</strong>
                    <br />

                    <div id="row">
                      <span className="material-symbols-rounded restaurantIcon">
                        list_alt
                      </span>
                      <span>Pedidos</span>
                    </div>
                  </div>

                  <div
                    className="isOpen"
                    style={{
                      backgroundColor: this.state.restaurant.isOpen
                        ? "#52E899"
                        : "#E4420F",
                    }}
                  >
                    <strong>
                      {this.state.restaurant.isOpen ? "ABERTO" : "FECHADO"}
                    </strong>
                  </div>
                </div>
              ) : (
                <div className="rowContent">
                  <div className="status" style={{ margin: "auto" }}>
                    <strong>{this.state.restaurant.status}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {this.state.restaurant.status == "operando" &&
          this.state.restaurant.acquirer != undefined ? (
            <div className="pageContentWrapper">
              <div className="leftContainer">
                <div className="row1">
                  <div className="card">
                    <p>Telefone:</p>

                    <strong>{this.state.restaurant.phoneNumber}</strong>
                  </div>

                  <div className="card">
                    <p>Categoria:</p>

                    <strong>{this.state.restaurant.category}</strong>
                  </div>

                  <div className="card">
                    <p>RanGo maior do mundo:</p>

                    <strong>Sim</strong>
                  </div>
                </div>

                <div className="row2">
                  <ul>
                    {this.state.timing.map((el) => {
                      return (
                        <li key={el.weekDay}>
                          <p>{el.weekDay}</p>

                          <div>
                            <strong>
                              {el.openingTime} - {el.closingTime}
                            </strong>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="accountInfo">
                    <div>
                      <p>Nome do Banco</p>

                      <strong>{this.state.billing.bank}</strong>
                    </div>

                    <div>
                      <div>
                        <p>Código do Banco</p>

                        <strong>
                          {this.state.billing.bankCode
                            ? this.state.billing.bankCode
                            : "N/A"}
                        </strong>
                      </div>

                      <div>
                        <p>Agência</p>

                        <strong>{this.state.billing.agency}</strong>
                      </div>
                    </div>

                    <div>
                      <p>Conta</p>

                      <strong>{this.state.billing.account}</strong>
                    </div>
                  </div>
                </div>

                <div className="row3">
                  <div>
                    <div>
                      <p>
                        Razão Social
                        <br />
                        <strong>{this.state.legal.razaoSocial}</strong>
                      </p>
                    </div>

                    <div>
                      <p>
                        CNPJ
                        <br />
                        <strong>{this.state.legal.cnpj}</strong>
                      </p>
                    </div>
                  </div>

                  <div>
                    <p>
                      Nome fantasia
                      <br />
                      <strong>
                        {this.state.legal.nomeFantasia
                          ? this.state.legal.nomeFantasia
                          : "N/A"}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="rightContainer">
                <div className="row1">
                  <div className="commissionCard">
                    <strong>
                      {this.state.restaurant.acquirer.currentPlan == "daily"
                        ? "Diário"
                        : this.state.restaurant.acquirer.currentPlan == "weekly"
                        ? "Semanal"
                        : "Mensal"}
                    </strong>
                  </div>
                </div>

                <div className="row2">
                  <strong>
                    R${this.state.restaurant.minimumOrderValue}
                    <br />
                    <p>Pedido Mínimo</p>
                  </strong>

                  <strong>
                    {this.state.restaurant.estimatedDeliveryTime} minutos
                    <br />
                    <p>Tempo de entrega médio</p>
                  </strong>

                  <div className="scheduleAvailable">
                    <div
                      style={{
                        backgroundColor: this.state.restaurant.scheduleAvailable
                          ? "#52e899"
                          : null,
                        flexDirection: this.state.restaurant.scheduleAvailable
                          ? "row-reverse"
                          : null,
                      }}
                      id="switch"
                    >
                      <div id="ball"></div>
                    </div>

                    <p>Aceita Agendamento</p>
                  </div>
                </div>

                <div className="row3">
                  <div>
                    <p>
                      CEP: <br />
                      <strong>{this.state.restaurant.address.cep}</strong>
                    </p>

                    <p>
                      Estado: <br />
                      <strong>{this.state.restaurant.address.state}</strong>
                    </p>

                    <p>
                      Cidade: <br />
                      <strong>{this.state.restaurant.address.city}</strong>
                    </p>

                    <p>
                      Bairro: <br />
                      <strong>
                        {this.state.restaurant.address.neighborhood}
                      </strong>
                    </p>
                  </div>

                  <p>
                    Endereço completo: <br />
                    <strong>
                      {this.state.restaurant.address.address} <br />{" "}
                      {this.state.restaurant.address.complement}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          ) : this.state.restaurant.status == "confirmado" ? (
            <div className="confirmedContainer">
              <h1>Criar subconta</h1>

              <Form id="subaccountForm">
                <Form.Group>
                  <Form.Label>Taxa antecipação</Form.Label>
                  <Form.Control
                    name="antecipationTax"
                    type="number"
                    step={0.01}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Taxa crédito</Form.Label>
                  <Form.Control
                    name="creditTax"
                    type="number"
                    step={0.01}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Taxa débito</Form.Label>
                  <Form.Control
                    name="debitTax"
                    type="number"
                    step={0.01}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Taxa PIX</Form.Label>
                  <Form.Control
                    name="pixTax"
                    type="number"
                    step={0.01}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Taxa crypto</Form.Label>
                  <Form.Control
                    name="cryptoTax"
                    type="number"
                    step={0.01}
                    required
                  />
                </Form.Group>
              </Form>

              <button onClick={this.createsubAccount}>Enviar</button>
            </div>
          ) : null}
        </section>
      </main>
    );
  }
}
