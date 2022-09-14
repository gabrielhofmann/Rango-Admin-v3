import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
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
      commission: [],
      totalRestaurantOrders: 0,
    };
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

      const data = await services.getPowerBiData();

      console.log(restaurant);

      data.ordersPerRestaurant.forEach((e) => {
        console.log(e);

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
        commission: restaurant.acquirer.commission,
      });

      $(".loading").hide();
    }
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

          <div className="pageContentWrapper">
            <div className="leftContainer">
              <div className="row1">
                <div className="card">
                  <p>Telefone:</p>

                  <strong>{this.state.restaurant.phoneNumber}</strong>
                </div>

                <div className="card">
                  <p>Proprietário:</p>

                  <strong>{this.state.restaurant.name}</strong>
                </div>

                <div className="card">
                  <p>Email:</p>

                  <strong>{this.state.restaurant.name}</strong>
                </div>
              </div>

              <div className="row2">
                <ul></ul>

                <div className="accountInfo">
                  <div>
                    <p>Nome do Banco</p>

                    <strong>banco</strong>
                  </div>

                  <div>
                    <div>
                      <p>Código do Banco</p>

                      <strong>codigo</strong>
                    </div>

                    <div>
                      <p>Agência</p>

                      <strong>agencia</strong>
                    </div>
                  </div>

                  <div>
                    <p>Conta</p>

                    <strong>conta</strong>
                  </div>
                </div>
              </div>

              <div className="row3">
                <div>
                  <div>
                    <p>
                      Razão Social
                      <br />
                      <strong>razao social</strong>
                    </p>
                  </div>

                  <div>
                    <p>
                      CNPJ
                      <br />
                      <strong>cnpj</strong>
                    </p>
                  </div>
                </div>

                <div>
                  <p>
                    Nome fantasia
                    <br />
                    <strong>nome fantasia</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="rightContainer">
              <div className="row1">
                {this.state.commission.map((el) => {
                  return (
                    <div className="commissionCard">
                      <strong>
                        {el.feePercent}%
                        <br />
                        {el.commissionPlan == "daily"
                          ? "Diário"
                          : el.commissionPlan == "weekly"
                          ? "Semanal"
                          : "Mensal"}
                      </strong>
                    </div>
                  );
                })}
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
                  <div id="switch">
                    <div id="ball"></div>
                  </div>

                  <p>Aceita Agendamento</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}
