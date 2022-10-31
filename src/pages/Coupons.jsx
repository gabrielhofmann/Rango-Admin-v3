import React, { Component } from "react";
import { Form, Spinner } from "react-bootstrap";
import Filter from "../components/Filter";
import Menu from "../components/Menu";
import { Services } from "../services";
import $ from "jquery";
import Select from "react-select";

import "./Coupons.scss";
import Pagination from "../components/Pagination";

const services = new Services();

export default class Coupons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validCoupons: [],
      expiredCoupons: [],

      filters: "",

      usersOptions: [],
      restaurantsOptions: [],
      restaurants: [],
      showPagination: true,
    };

    this.handleNewCoupon = this.handleNewCoupon.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.setCoupons = this.setCoupons.bind(this);
  }

  async componentDidMount() {
    sessionStorage.setItem("isMenuActive", false);
    const token = sessionStorage.getItem("token");
    $(".loading").show();

    if (!token) {
      $(".loading").hide();
      $(".coupons").html("Not Authorized!!");
    } else {
      let date = new Date();
      date = date.toISOString().split("T")[0];

      const filtersValid = `?filters[validThru][$gte]=${date}`;
      const filtersExpired = `?filters[validThru][$lte]=${date}`;

      const validCoupons = await services.getCoupons(0, filtersValid);
      const expiredCoupons = await services.getCoupons(0, filtersExpired);

      console.log(validCoupons);

      $("#availableNav").addClass("active");
      sessionStorage.setItem("coupons", ".availableCoupons");

      $(".expiredCoupons").hide();
      $(".newCoupon").hide();

      $(".coupons").on("click", () => {
        let active = sessionStorage.getItem("isMenuActive");

        if (active == "true") {
          services.handleMenuToggle();
        }
      });

      const users = await services.getUsers(0);
      const restaurants = await services.getRestaurants(0);

      const usersOptions = users.users.map((user) => {
        return {
          label: user.username,
          value: user.id,
        };
      });

      const restaurantsOptions = restaurants.restaurants.map((restaurant) => {
        return {
          label: restaurant.name,
          value: restaurant.id,
        };
      });

      document
        .querySelector(".userSearch")
        .querySelector(".select__input")
        .addEventListener("keyup", async (e) => {
          const input = e.target.value;

          let isNumber = /^\d+$/.test(input);

          if (isNumber) {
            const users = await services.filterUsers(input, "id");

            const options = users.map((user) => {
              return {
                label: user.username,
                value: user.id,
              };
            });

            this.setState({ usersOptions: options });
          } else {
            if (input.length >= 3) {
              const users = await services.filterUsers(input, "username");

              const options = users.map((user) => {
                return {
                  label: user.username,
                  value: user.id,
                };
              });

              this.setState({ usersOptions: options });
            }
          }
        });

      document
        .querySelector(".restaurantSearch")
        .querySelector(".select__input")
        .addEventListener("keyup", async (e) => {
          const input = e.target.value;

          let isNumber = /^\d+$/.test(input);

          if (isNumber) {
            const restaurants = await services.filterRestaurants(input, "id");

            const options = restaurants.map((restaurant) => {
              return {
                label: restaurant.name,
                value: restaurant.id,
              };
            });

            this.setState({ restaurantsOptions: options });
          } else {
            if (input.length >= 3) {
              const restaurants = await services.filterRestaurants(
                input,
                "name"
              );

              const options = restaurants.map((restaurant) => {
                return {
                  label: restaurant.name,
                  value: restaurant.id,
                };
              });

              this.setState({ restaurantsOptions: options });
            }
          }
        });

      this.setState({
        validCoupons: validCoupons,
        expiredCoupons: expiredCoupons,
        usersOptions: usersOptions,
        restaurantsOptions: restaurantsOptions,
        filters: filtersValid,
        filtersValid: filtersValid,
        filtersExpired: filtersExpired,
      });

      $(".loading").hide();
    }
  }

  handleNavigation(page, element, selector) {
    let currentNav = sessionStorage.getItem(page);
    let navLinks = $(".navLink");

    navLinks.each(function (index, element) {
      $(element).removeClass("active");
    });

    $(selector).addClass("active");

    if (!currentNav) {
      sessionStorage.setItem(page, element);
    } else {
      $(currentNav).hide();
      sessionStorage.setItem(page, element);
      $(element).show();
    }
  }

  async handleNewCoupon(e) {
    e.preventDefault();

    $(".loading").show();

    let body = {};

    const formData = $("#newCouponForm").serializeArray();

    formData.forEach((data) => {
      if (data.value.trim() != "") {
        body[`${data.name}`] = data.value;
      }
    });

    body.singleUse == undefined
      ? (body.singleUse = false)
      : (body.singleUse = true);

    body = {
      data: {
        ...body,
        restaurants: this.state.restaurants,
      },
    };

    const response = await services.newCoupon(body);

    $(".loading").hide();

    window.location.reload();
  }

  setCoupons = (results) => {
    const currentFilter = this.state.filters;
    currentFilter.includes("gte")
      ? this.setState({
          validCoupons: results,
        })
      : this.setState({
          expiredCoupons: results,
        });
  };

  render() {
    return (
      <main className="coupons">
        <Menu />

        {this.state.showPagination ? (
          <Pagination
            id="couponsPagination"
            target="coupons"
            filters={this.state.filters}
            callback={this.setCoupons}
          />
        ) : null}

        <div className="loading">
          <Spinner className="spinner" animation="border" />
        </div>

        <div id="couponsHeader" className="pageHeader">
          <div className="menuToggle" onClick={services.handleMenuToggle}>
            <span className="material-symbols-rounded">menu</span>
          </div>

          <div className="pageTitle">
            <h1>Cupons</h1>
            <span className="material-symbols-rounded">sell</span>
          </div>
        </div>

        <Filter
          target="coupons"
          callback={this.setCoupons}
          filters={this.state.filters}
        />

        <nav className="couponsNav">
          <ul>
            <li
              id="availableNav"
              className="navLink"
              onClick={(e) => {
                this.setState({
                  filters: this.state.filtersValid,
                  showPagination: true,
                });
                this.handleNavigation("coupons", ".availableCoupons", e.target);
              }}
              key="availableNav"
            >
              Disponíveis
            </li>

            <li
              id="expiredNav"
              className="navLink"
              onClick={(e) => {
                this.setState({
                  filters: this.state.filtersExpired,
                  showPagination: true,
                });
                this.handleNavigation("coupons", ".expiredCoupons", e.target);
              }}
              key="expiredNav"
            >
              Expirados
            </li>

            <li
              id="restaurantsNav"
              className="navLink"
              onClick={(e) => {
                this.handleNavigation("coupons", ".newCoupon", e.target);
                this.setState({ showPagination: false });
              }}
              key="restaurantsNavKey"
            >
              Criar novo
            </li>
          </ul>
        </nav>

        <section className="availableCoupons">
          <div className="couponsNameplates">
            <strong>ID</strong>
            <strong>Código</strong>
            <strong>Tipo</strong>
            <strong>Valor</strong>
            <strong>Uso único</strong>
            <strong>Total cupons</strong>
            <strong>Validade</strong>
            <strong>Usuário</strong>
            <strong>Restaurante</strong>
          </div>

          {this.state.validCoupons.map((coupon) => {
            return (
              <div className="couponCard">
                <strong>#ID {coupon.id}</strong>
                <strong>{coupon.name}</strong>
                <strong>{coupon.discountType}</strong>
                <strong>{coupon.discount}</strong>
                <strong>{coupon.singleUse ? "SIM" : "NÃO"}</strong>
                <strong>{coupon.numberOfCoupons}</strong>
                <strong>{coupon.validThru}</strong>
                <strong>{coupon.user ? coupon.user.username : "N/A"}</strong>
                <strong>
                  {coupon.restaurants.length > 0
                    ? coupon.restaurants.map((restaurant) => {
                        return restaurant.name + " | ";
                      })
                    : "N/A"}
                </strong>
              </div>
            );
          })}
        </section>

        <section className="expiredCoupons">
          <div className="couponsNameplates">
            <strong>ID</strong>
            <strong>Código</strong>
            <strong>Tipo</strong>
            <strong>Valor</strong>
            <strong>Uso único</strong>
            <strong>Total cupons</strong>
            <strong>Validade</strong>
            <strong>Usuário</strong>
            <strong>Restaurante</strong>
          </div>

          {this.state.expiredCoupons.map((coupon) => {
            return (
              <div className="couponCard">
                <strong>#ID {coupon.id}</strong>
                <strong>{coupon.name}</strong>
                <strong>{coupon.discountType}</strong>
                <strong>{coupon.discount}</strong>
                <strong>{coupon.singleUse ? "SIM" : "NÃO"}</strong>
                <strong>{coupon.numberOfCoupons}</strong>
                <strong>{coupon.validThru}</strong>
                <strong>{coupon.user ? coupon.user : "N/A"}</strong>
                <strong>
                  {coupon.restaurants.length == 0
                    ? "N/A"
                    : coupon.restaurants.length > 1
                    ? coupon.restaurants.map((restaurant) => {
                        return `\xa0\xa0\xa0${restaurant.name}`;
                      })
                    : coupon.restaurants[0].name}
                </strong>
              </div>
            );
          })}
        </section>

        <section className="newCoupon">
          <Form id="newCouponForm" onSubmit={this.handleNewCoupon}>
            <Form.Group className="newCouponGroup" id="group1">
              <Form.Label htmlFor="name">Código</Form.Label>
              <Form.Control
                name="name"
                type="text"
                placeholder="RANGO10"
                required
              />

              <Form.Label htmlFor="numberOfCoupons">Total cupons</Form.Label>
              <Form.Control
                name="numberOfCoupons"
                type="number"
                placeholder="100"
                required
              />

              <Form.Label htmlFor="validThru">Validade</Form.Label>
              <Form.Control name="validThru" type="date" required />

              <Form.Check
                id="singleUse"
                name="singleUse"
                type="checkbox"
                label="Uso único"
              />
            </Form.Group>

            <Form.Group className="newCouponGroup" id="group2">
              <Form.Label htmlFor="discount">Desconto</Form.Label>
              <Form.Control
                name="discount"
                type="number"
                placeholder="10"
                required
              />

              <Form.Check
                name="discountType"
                type="radio"
                label="Porcentagem"
                value="percentage"
                required
              />

              <Form.Check
                name="discountType"
                type="radio"
                label="Valor"
                value="value"
                required
              />
            </Form.Group>

            <Form.Group className="newCouponGroup" id="group3">
              <Form.Label htmlFor="user">Usuário</Form.Label>

              <Select
                name="user"
                className="basic-single customSelect userSearch"
                classNamePrefix="select"
                options={this.state.usersOptions}
                isSearchable="true"
              ></Select>

              <Form.Label htmlFor="restaurants">Restaurante(s)</Form.Label>

              <Select
                name="restaurants"
                className="basic-multi-select customSelect restaurantSearch"
                classNamePrefix="select"
                options={this.state.restaurantsOptions}
                isSearchable="true"
                onChange={(e) => {
                  let restaurants = [];

                  e.forEach((el) => {
                    restaurants.push(el.value);
                  });

                  this.setState({
                    restaurants: restaurants,
                  });
                }}
                isMulti
              ></Select>
            </Form.Group>

            <button type="submit">Criar</button>
          </Form>
        </section>
      </main>
    );
  }
}
