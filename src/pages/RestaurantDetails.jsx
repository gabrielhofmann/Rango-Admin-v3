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

      $(".restaurantDetails").on("click", () => {
        let active = sessionStorage.getItem("isMenuActive");

        if (active == "true") {
          services.handleMenuToggle();
        }
      });

      this.setState({
        restaurant: restaurant,
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
            <h1>{this.state.name}</h1>
            <span className="material-symbols-rounded">store</span>
          </div>
        </div>

        <section className="restaurantDetailsContainer">
          <div className="smallInfoBox">
            <div className="smallInfoBoxHeader">
              <div
                className="smallInfoBoxHeaderImage"
                style={{
                  backgroundImage: this.state.restaurant.thumbnailImageUrl
                    ? `url(${this.state.restaurant.thumbnailImageUrl})`
                    : `url(${logo})`,
                }}
              ></div>

              <div className="smallInfoBoxHeaderText">
                <p>#ID {this.state.restaurant.id}</p>
                <strong>{this.state.restaurant.name}</strong>
              </div>
            </div>

            <strong
              className="smallInfoBoxStatus"
              style={{
                color:
                  this.state.restaurant.status == "pendente"
                    ? "#f18a33"
                    : this.state.restaurant.status == "recusado"
                    ? "red"
                    : this.state.restaurant.status == "operando"
                    ? "#52e899"
                    : "black",
              }}
            >
              {this.state.restaurant.status}
            </strong>
          </div>
        </section>
      </main>
    );
  }
}
