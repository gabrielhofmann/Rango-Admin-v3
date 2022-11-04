import React, { Component } from "react";
import Menu from "../components/Menu";
import $ from "jquery";
import { Alert, Button, Spinner } from "react-bootstrap";
import { Services } from "../services";

import "./PowerBi.scss";
import Filter from "../components/Filter";
import Pagination from "../components/Pagination";

import logo from "../assets/logo.svg";
import axios from "axios";

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
        totalOrders: {
          today: 0,
          week: 0,
          month: 0,
        },
      },
      users: [],
      numberOfUsers: 0,
      orders: [],
      numberOfOrders: 0,
      restaurants: [],
      numberOfRestaurants: 0,
      userDetails: {},
      showUserAlert: false,
      restaurantDetails: {},
      showRestaurantAlert: false,
      filteredData: {
        newUsers: {
          month: 0,
        },
        revenue: {
          month: 0,
        },
        totalOrders: {
          month: 0,
        },
      },
      start: "",
      end: "",
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

      setInterval(function () {
        if (
          window.location.href == "https://rango-admin-v3.vercel.app/powerBi"
        ) {
          window.location.reload();
        }
      }, 300000);

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
      this.filterPowerBi = this.filterPowerBi.bind(this);
    }
  }

  setOrders = (results) => {
    this.setState({ orders: results });
  };

  setRestaurants = (results) => {
    console.log(results);
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
      $("#timeIntervalFilter").show();
    } else {
      $("#timeIntervalFilter").hide();
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

  async handleUserAlert(user) {
    console.log(user);
    this.setState({
      showUserAlert: true,
      userDetails: user,
    });
  }

  async handleRestaurantAlert(restaurant) {
    console.log(restaurant);
    this.setState({
      showRestaurantAlert: true,
      restaurantDetails: restaurant,
    });
  }

  async filterPowerBi() {
    const form = $("#powerBiTimeFilter").serializeArray();
    const [start, end] = [
      `${form[0].value.split("-")[0]}-${(
        parseInt(form[0].value.split("-")[1]) - 1
      ).toString()}-${form[0].value.split("-")[2]}`,
      `${form[1].value.split("-")[0]}-${(
        parseInt(form[1].value.split("-")[1]) - 1
      ).toString()}-${form[1].value.split("-")[2]}`,
    ];

    const data = await axios.get(
      `https://www.api.rangosemfila.com.br/v2/getPowerBIData/${start}/${end}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    $(".smallCard").each((index, el) => {
      $(el).addClass("active");
    });

    console.log(data.data);

    this.setState({
      filteredData: data.data,
      powerBiData: {
        ...this.state.powerBiData,
        mau: data.data.mau,
        ordersPerRestaurant: data.data.ordersPerRestaurant,
        usersPerRestaurant: data.data.usersPerRestaurant,
      },
    });
  }

  render() {
    return (
      <main className="powerBi">
        <Menu />

        <Alert
          className="powerBiAlert"
          show={this.state.showUserAlert}
          onClose={() => {
            this.setState({ showUserAlert: false });
          }}
          dismissible
        >
          <Alert.Heading className="powerBiAlertHeader">
            {this.state.userDetails.username}
            <br />
            <p>#ID {this.state.userDetails.id}</p>
          </Alert.Heading>

          <ul>
            <li key="userAlertConfirmed">
              <p>Confimado</p>
              <strong>
                {this.state.userDetails.confirmed ? "SIM" : "NÃO"}
              </strong>
            </li>

            <li key="userAlertBlocked">
              <p>Bloqueado</p>
              <strong>{this.state.userDetails.blocked ? "SIM" : "NÃO"}</strong>
            </li>

            <li key="userAlertEmail">
              <p>Email</p> <strong>{this.state.userDetails.email}</strong>
            </li>

            <li key="userAlertEmailConfirmed">
              <p>Email confirmado</p>
              <strong>
                {this.state.userDetails.emailConfirmed ? "SIM" : "NÃO"}
              </strong>
            </li>

            <li key="userAlertPhoneNumber">
              <p>Telefone</p>
              <strong>{this.state.userDetails.phoneNumber}</strong>
            </li>

            <li key="userAlertPhoneConfirmed">
              <p>Telefone confirmado</p>
              <strong>
                {this.state.userDetails.phoneNumberConfirmed ? "SIM" : "NÃO"}
              </strong>
            </li>

            <li key="userAlertCPF">
              <p>CPF</p>
              <strong>{this.state.userDetails.cpf}</strong>
            </li>
          </ul>
        </Alert>

        <Alert
          className="powerBiAlert"
          show={this.state.showRestaurantAlert}
          onClose={() => {
            this.setState({ showRestaurantAlert: false });
          }}
          dismissible
        >
          <Alert.Heading className="powerBiAlertHeader">
            {this.state.restaurantDetails.name}
            <br />
            <p>#ID {this.state.restaurantDetails.id}</p>
          </Alert.Heading>

          <ul>
            <li key="restaurantAlertisOpen">
              <p>Aberto</p>
              <strong>
                {this.state.restaurantDetails.isOpen ? "SIM" : "NÃO"}
              </strong>
            </li>

            <li key="restaurantAlertScheduleAvailable">
              <p>Agendamento habilitado</p>
              <strong>
                {this.state.restaurantDetails.scheduleAvailable ? "SIM" : "NÃO"}
              </strong>
            </li>

            <li key="restaurantAlertPendingOrdersLimit">
              <p>Máximo ordens pendentes</p>
              <strong>{this.state.restaurantDetails.pendingOrdersLimit}</strong>
            </li>

            <li key="restaurantAlertRating">
              <p>Rating</p>
              <strong>{this.state.restaurantDetails.rating}</strong>
            </li>

            <li key="restaurantAlertStatus">
              <p>Status</p>
              <strong>{this.state.restaurantDetails.status}</strong>
            </li>

            <li key="restaurantAlertCategory">
              <p>Categoria</p>
              <strong>{this.state.restaurantDetails.category}</strong>
            </li>

            <li key="restaurantAlertDeliveryTime">
              <p>Tempo de entrega</p>
              <strong>
                {this.state.restaurantDetails.estimatedDeliveryTime}
              </strong>
            </li>

            <li key="restaurantAlertMinimumOrderValue">
              <p>Valor mínimo</p>
              <strong>
                R$ {this.state.restaurantDetails.minimumOrderValue}
              </strong>
            </li>

            <li key="restaurantAlertPhoneNumber">
              <p>Telefone</p>
              <strong>{this.state.restaurantDetails.phoneNumber}</strong>
            </li>
          </ul>
        </Alert>

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

        <div id="timeIntervalFilter">
          <form
            id="powerBiTimeFilter"
            onSubmit={(e) => {
              e.preventDefault();
              this.filterPowerBi();
            }}
            onChange={() => {
              $("#clear").show();
            }}
          >
            <button
              onClick={() => {
                window.location.reload();
              }}
              id="clear"
            >
              Limpar
            </button>

            <input
              onChange={(e) => {
                this.setState({
                  start: e.target.value,
                });
              }}
              type="date"
              name="start"
            />

            <input
              onChange={(e) => {
                this.setState({
                  end: e.target.value,
                });
              }}
              type="date"
              name="end"
            />

            <button type="submit">Filtrar</button>
          </form>
        </div>

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

              <div className="filteredDataContainer">
                <strong>
                  Novos Usuários entre {this.state.start} e {this.state.end}
                </strong>

                <div className="resultsRow">
                  <p>Total:</p>
                  <p>{this.state.filteredData.newUsers.month}</p>
                </div>
              </div>
            </div>

            <div className="smallCard smallListCard">
              <h1>Pedidos</h1>
              <div className="listRow">
                <ul>
                  <li key="todayTotalOrders">
                    <p>
                      Hoje:{" "}
                      <span>{this.state.powerBiData.totalOrders.today}</span>
                    </p>
                  </li>

                  <li key="weekTotalOrders">
                    <p>
                      Semana:{" "}
                      <span>{this.state.powerBiData.totalOrders.week}</span>
                    </p>
                  </li>

                  <li key="monthTotalOrders">
                    <p>
                      Mês:{" "}
                      <span>{this.state.powerBiData.totalOrders.month}</span>
                    </p>
                  </li>
                </ul>
              </div>

              <div className="filteredDataContainer">
                <strong>
                  Pedidos entre {this.state.start} e {this.state.end}
                </strong>

                <div className="resultsRow">
                  <p>Total:</p>
                  <p>{this.state.filteredData.totalOrders.month}</p>
                </div>
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

              <div className="filteredDataContainer">
                <strong>
                  Receita entre {this.state.start} e {this.state.end}
                </strong>

                <div className="resultsRow">
                  <p>Total:</p>
                  <p>R$ {this.state.filteredData.revenue.month}</p>
                </div>
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
                    <li key={element.restaurant}>
                      <span>{element.restaurant}</span>
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
                    <li key={element.restaurant}>
                      <span>{element.restaurant}</span>
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
                    <button
                      onClick={() => {
                        this.handleUserAlert(order.user);
                      }}
                    >
                      Ver usuário
                    </button>

                    <button
                      onClick={() => {
                        this.handleRestaurantAlert(order.restaurant);
                      }}
                    >
                      Ver restaurante
                    </button>

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

                  <strong
                    style={{
                      color: "#717171",
                      fontSize: "1.3rem",
                      textAlign: "start",
                    }}
                  >
                    {restaurant.name} <br />
                    <span
                      style={{
                        fontSize: "1.1rem",
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

                  <button
                    onClick={() => {
                      sessionStorage.setItem("restaurantId", restaurant.id);

                      sessionStorage.setItem("restaurantName", restaurant.name);

                      sessionStorage.setItem(
                        "restaurantStatus",
                        restaurant.status
                      );

                      window.location.href = "/#/detalhesRestaurante";
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
