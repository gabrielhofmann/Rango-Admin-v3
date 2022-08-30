import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
import { Services } from "../services";
import $ from "jquery";

import "./Pagination.scss";

const services = new Services();

export default class Pagination extends Component {
  constructor(props) {
    super(props);

    this.state = { currentPage: 1, maxPage: 0 };

    this.firstPage = this.firstPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
  }

  async componentDidMount() {
    let response;

    switch (this.props.target) {
      case "orders":
        response = await services.getOrders(0);

        break;

      case "restaurants":
        response = await services.getRestaurants(0);

        break;

      case "users":
        response = await services.getUsers(0);

        break;

      default:
        break;
    }

    this.setState({ maxPage: Math.ceil(response.count / 10) }, () => {
      console.log(this.state);
    });
  }

  async firstPage() {
    $(".loading").show();

    switch (this.props.target) {
      case "orders":
        const orders = await services.getOrders(0);

        this.setState({ currentPage: 1 });
        this.props.callback(orders.orders);
        break;

      case "restaurants":
        const restaurants = await services.getRestaurants(0);

        this.setState({ currentPage: 1 });
        this.props.callback(restaurants.restaurants);
        break;

      case "users":
        const users = await services.getUsers(0);

        this.setState({ currentPage: 1 });
        this.props.callback(users.users);
        break;

      default:
        break;
    }

    $(".loading").hide();
  }

  async previousPage() {
    $(".loading").show();

    if (this.state.currentPage == 1) {
    } else if (this.state.currentPage > 1) {
      switch (this.props.target) {
        case "orders":
          const orders = await services.getOrders(
            (this.state.currentPage - 2) * 10
          );

          this.setState({ currentPage: this.state.currentPage - 1 });
          this.props.callback(orders.orders);
          break;

        case "restaurants":
          const restaurants = await services.getRestaurants(
            (this.state.currentPage - 2) * 10
          );

          this.setState({ currentPage: this.state.currentPage - 1 });
          this.props.callback(restaurants.restaurants);
          break;

        case "users":
          const users = await services.getUsers(
            (this.state.currentPage - 2) * 10
          );

          this.setState({ currentPage: this.state.currentPage - 1 });
          this.props.callback(users.users);
          break;

        default:
          break;
      }
    }

    $(".loading").hide();
  }

  async nextPage() {
    $(".loading").show();

    if (this.state.currentPage < this.state.maxPage) {
      switch (this.props.target) {
        case "orders":
          const orders = await services.getOrders(this.state.currentPage * 10);

          this.setState({ currentPage: this.state.currentPage + 1 });
          this.props.callback(orders.orders);
          break;

        case "restaurants":
          const restaurants = await services.getRestaurants(
            this.state.currentPage * 10
          );

          this.setState({ currentPage: this.state.currentPage + 1 });
          this.props.callback(restaurants.restaurants);
          break;

        case "users":
          const users = await services.getUsers(this.state.currentPage * 10);

          this.setState({ currentPage: this.state.currentPage + 1 });
          this.props.callback(users.users);
          break;

        default:
          break;
      }
    }

    $(".loading").hide();
  }

  async lastPage() {
    $(".loading").show();

    switch (this.props.target) {
      case "orders":
        const orders = await services.getOrders((this.state.maxPage - 1) * 10);

        this.setState({ currentPage: this.state.maxPage });
        this.props.callback(orders.orders);
        break;

      case "restaurants":
        const restaurants = await services.getRestaurants(
          (this.state.maxPage - 1) * 10
        );

        this.setState({ currentPage: this.state.maxPage });
        this.props.callback(restaurants.restaurants);
        break;

      case "users":
        const users = await services.getUsers((this.state.maxPage - 1) * 10);

        this.setState({ currentPage: this.state.maxPage });
        this.props.callback(users.users);
        break;

      default:
        break;
    }

    $(".loading").hide();
  }

  render() {
    return (
      <main className="pagination">
        <div className="loading">
          <Spinner className="spinner" animation="border" />
        </div>

        <div className="paginationContainer">
          <span onClick={this.firstPage} className="material-symbols-rounded">
            keyboard_double_arrow_left
          </span>

          <span
            onClick={this.previousPage}
            className="material-symbols-rounded"
          >
            arrow_back_ios
          </span>

          <strong>{this.state.currentPage}</strong>

          <span onClick={this.nextPage} className="material-symbols-rounded">
            arrow_forward_ios
          </span>

          <span onClick={this.lastPage} className="material-symbols-rounded">
            keyboard_double_arrow_right
          </span>
        </div>
      </main>
    );
  }
}
