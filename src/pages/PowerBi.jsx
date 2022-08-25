import React, { Component } from "react";
import Menu from "../components/Menu";
import $ from "jquery";
import { Button, Spinner } from "react-bootstrap";
import { Services } from "../services";

import "./PowerBi.scss";
import Filter from "../components/Filter";
import Pagination from "../components/Pagination";

import logo from "../assets/logo.svg";

const services = new Services();

export default class PowerBi extends Component {
  constructor(props) {
    super(props);

    this.state = {
      powerBiData: {
        newUsers: {
          today: 0,
          week: 0,
          month: 0,
        },
        revenue: {
          today: 0,
          week: 0,
          month: 0,
        },
        ordersPerRestaurant: [],
        usersPerRestaurant: [],
        deliveryTimePerRestaurant: [],
      },
      users: [],
      numberOfUsers: 0,
      orders: [],
      numberOfOrders: 0,
      restaurants: [],
      numberOfRestaurants: 0,
    };
  }

  async componentDidMount() {
    sessionStorage.setItem("isMenuActive", false);
    const token = sessionStorage.getItem("token");
    $(".loading").show();

    if (!token) {
      $(".loading").hide();
      $(".powerBi").html("Not Authorized!!");
    } else {
      $(".loading").show();

      const data = await services.getPowerBiData();
      const users = await services.getUsers(0);
      const orders = await services.getOrders(0);
      const restaurants = await services.getRestaurants(0);

      $(".loading").hide();

      $("#infoNav").addClass("active");
      sessionStorage.setItem("powerbi", ".powerBiContainer");

      $(".powerBi").on("click", () => {
        let active = sessionStorage.getItem("isMenuActive");

        if (active == "true") {
          services.handleMenuToggle();
        }
      });

      this.setState({
        powerBiData: data,
        users: users.users,
        numberOfUsers: users.count,
        orders: orders.orders,
        numberOfOrders: orders.count,
        restaurants: restaurants.restaurants,
        numberOfRestaurants: restaurants.count,
        paginationResults: [],
      });

      this.handleNavigation = this.handleNavigation.bind(this);
      this.setOrders = this.setOrders.bind(this);
      this.setRestaurants = this.setRestaurants.bind(this);
    }
  }

  setOrders = (results) => {
    this.setState({ orders: results });
  };

  setRestaurants = (results) => {
    this.setState({ restaurants: results });
  };

  handleNavigation(page, element, selector) {
    let currentNav = sessionStorage.getItem(page);
    let navLinks = $(".navLink");

    navLinks.each(function (index, element) {
      $(element).removeClass("active");
    });

    $(selector).addClass("active");

    if (page == "powerbi" && selector == document.getElementById("infoNav")) {
      $(".noCardDisplay").show();
      $(".powerBiNav").css("marginTop", "0");
    } else {
      $(".noCardDisplay").hide();
      $(".powerBiNav").css("marginTop", "17vh");
    }

    if (!currentNav) {
      sessionStorage.setItem(page, element);
    } else {
      $(currentNav).hide();
      sessionStorage.setItem(page, element);
      $(element).show();
    }
  }

  render() {
    return (
      <main className="powerBi">
        <Menu />

        <div className="loading">
          <Spinner className="spinner" animation="border" />
        </div>

        <div className="pageHeader">
          <div className="menuToggle" onClick={services.handleMenuToggle}>
            <span className="material-symbols-rounded">menu</span>
          </div>

          <div className="pageTitle">
            <h1>Power BI</h1>
            <span className="material-symbols-rounded">monitoring</span>
          </div>
        </div>

        <div className="noCardDisplay">
          <div>
            <h1>{this.state.numberOfOrders}</h1>
            <p>
              <span className="material-symbols-rounded">shopping_bag</span>
              Pedidos
            </p>
          </div>

          <div>
            <h1>{this.state.powerBiData.mau}</h1>
            <p>
              <span className="material-symbols-rounded">shopping_bag</span>
              MAU
            </p>
          </div>

          <div>
            <h1>{this.state.numberOfRestaurants}</h1>
            <p>
              <span className="material-symbols-rounded">store</span>
              Restaurantes
            </p>
          </div>
        </div>

        <nav className="powerBiNav">
          <ul>
            <li
              id="infoNav"
              className="navLink"
              onClick={(e) => {
                this.handleNavigation("powerbi", ".powerBiContainer", e.target);
              }}
              key="infoNavKey"
            >
              Informações
            </li>

            <li
              id="ordersNav"
              className="navLink"
              name=""
              onClick={(e) => {
                this.handleNavigation("powerbi", ".ordersContainer", e.target);
              }}
              key="ordersNavKey"
            >
              Pedidos
            </li>

            <li
              id="restaurantsNav"
              className="navLink"
              onClick={(e) => {
                this.handleNavigation(
                  "powerbi",
                  ".restaurantsContainer",
                  e.target
                );
              }}
              key="restaurantsNavKey"
            >
              Restaurantes
            </li>
          </ul>
        </nav>

        <section className="pageContainer powerBiContainer">
          <div className="smallCardsContainer">
            <div className="smallCard smallListCard">
              <h1>Novos Usuários</h1>
              <div className="listRow">
                <ul>
                  <li key="todayUsers">
                    <p>
                      Hoje: <span>{this.state.powerBiData.newUsers.today}</span>
                    </p>
                  </li>

                  <li key="weekUsers">
                    <p>
                      Semana:{" "}
                      <span>{this.state.powerBiData.newUsers.week}</span>
                    </p>
                  </li>

                  <li key="monthUsers">
                    <p>
                      Mês: <span>{this.state.powerBiData.newUsers.month}</span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="smallCard smallListCard">
              <h1>Pedidos</h1>
              <div className="listRow">
                <ul>
                  <li key="todayRevenue">
                    <p>
                      Hoje: <span>{this.state.powerBiData.revenue.today}</span>
                    </p>
                  </li>

                  <li key="weekRevenue">
                    <p>
                      Semana: <span>{this.state.powerBiData.revenue.week}</span>
                    </p>
                  </li>

                  <li key="monthRevenue">
                    <p>
                      Mês: <span>{this.state.powerBiData.revenue.month}</span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="smallCard smallListCard">
              <h1>Receita</h1>
              <div className="listRow">
                <ul>
                  <li key="todayRevenue">
                    <p>
                      Hoje:{" "}
                      <span>R${this.state.powerBiData.revenue.today}</span>
                    </p>
                  </li>

                  <li key="weekRevenue">
                    <p>
                      Semana:{" "}
                      <span>R${this.state.powerBiData.revenue.week}</span>
                    </p>
                  </li>

                  <li key="monthRevenue">
                    <p>
                      Mês: <span>R${this.state.powerBiData.revenue.month}</span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bigCardsContainer">
            <div className="bigCard">
              <h1>Pedidos por restaurante</h1>

              <input type="text" placeholder="Buscar" />

              <ul>
                {this.state.powerBiData.ordersPerRestaurant.map((element) => {
                  return (
                    <li key={element.restaurant.name}>
                      <span>{element.restaurant.name}</span>
                      <span>{element.orders}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bigCard">
              <h1>Usuários por restaurante</h1>

              <input type="text" placeholder="Buscar" />

              <ul>
                {this.state.powerBiData.usersPerRestaurant.map((element) => {
                  return (
                    <li key={element.restaurant.name}>
                      <span>{element.restaurant.name}</span>
                      <span>{element.users}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bigCard">
              <h1>Tempo médio de espera por restaurante</h1>

              <input type="text" placeholder="Buscar" />

              <ul>
                {this.state.powerBiData.deliveryTimePerRestaurant.map(
                  (element) => {
                    return (
                      <li key={element.restaurant}>
                        <span>{element.restaurant}</span>
                        <span>{element.deliveryTime}</span>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
          </div>
        </section>

        <section
          style={{ display: "none" }}
          className="pageContainer ordersContainer"
        >
          <Filter target="orders" callback={this.setOrders} />

          <Pagination target="orders" callback={this.setOrders} />

          <div className="orderCardsContainer">
            <strong style={{ marginLeft: "2.7rem" }}>ID</strong>
            <strong>Cliente</strong>
            <strong>Restaurante</strong>
            <strong>Criado em</strong>
            <strong>Atualizado em</strong>
            <strong>Status</strong>
            <strong>Total</strong>

            {this.state.orders.map((order) => {
              return (
                <div className="orderCard">
                  <strong>#ID {order.id}</strong>
                  <strong>{order.user.username}</strong>
                  <strong>{order.restaurant.name}</strong>
                  <strong>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </strong>
                  <strong>
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </strong>
                  <strong>{order.status}</strong>
                  <strong style={{ color: "#52e899" }}>
                    R$ {order.history.payment.total}
                  </strong>

                  <div className="cardButtons">
                    <button>Ver usuário</button>

                    <button>Ver restaurante</button>

                    <button>Mais</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          style={{ display: "none" }}
          className="pageContainer restaurantsContainer"
        >
          <Filter target="restaurants" callback={this.setRestaurants} />

          <Pagination target="restaurants" callback={this.setRestaurants} />

          <div className="restaurantCardsContainer">
            <strong></strong>
            <strong>Nome/ID</strong>
            <strong>Status</strong>
            <strong>Categoria</strong>
            <strong>Aberto</strong>
            <strong>Telefone</strong>
            <strong>Rating</strong>

            {this.state.restaurants.map((restaurant) => {
              console.log(restaurant);

              return (
                <div className="restaurantCard">
                  <div
                    className="restaurantCardImage"
                    style={{
                      backgroundImage: restaurant.thumbnailImageUrl
                        ? `url(${restaurant.thumbnailImageUrl})`
                        : `url(${logo})`,
                    }}
                  ></div>

                  <strong style={{ color: "#717171", fontSize: "1.6rem" }}>
                    {restaurant.name} <br />
                    <span
                      style={{
                        fontSize: "1.3rem",
                        display: "flex",
                        marginTop: "-.3rem",
                      }}
                    >
                      #ID{restaurant.id}
                    </span>
                  </strong>

                  <strong>{restaurant.status}</strong>

                  <strong>{restaurant.category}</strong>

                  <strong
                    style={{ color: restaurant.isOpen ? "green" : "red" }}
                  >
                    {restaurant.isOpen ? "SIM" : "NÃO"}
                  </strong>

                  <strong>{restaurant.phoneNumber}</strong>

                  <strong style={{ color: "#52e899" }}>
                    {restaurant.rating}
                  </strong>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    );
  }
}
