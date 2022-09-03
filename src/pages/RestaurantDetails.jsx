import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
import Menu from "../components/Menu";
import { Services } from "../services";
import $, { getJSON } from "jquery";

import "./RestaurantDetails.scss";

const services = new Services();

export default class RestaurantDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
    };
  }

  async componentDidMount() {
    sessionStorage.setItem("isMenuActive", false);
    const token = sessionStorage.getItem("token");

    if (!token) {
      $(".restaurantDetails").html("Not Authorized!!");
    } else {
      $(".loading").show();

      const restaurantId = sessionStorage.getItem("restaurantId");
      const restaurantName = sessionStorage.getItem("restaurantName");
      const restaurantStatus = sessionStorage.getItem("restaurantStatus");

      console.log(restaurantId);

      $(".restaurantDetails").on("click", () => {
        let active = sessionStorage.getItem("isMenuActive");

        if (active == "true") {
          services.handleMenuToggle();
        }
      });

      this.setState({
        id: restaurantId,
        name: restaurantName,
        status: restaurantStatus,
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
              <div className="smallInfoBoxHeaderImage"></div>

              <div className="smallInfoBoxHeaderText">
                <p>#ID {this.state.id}</p>
                <strong>{this.state.name}</strong>
              </div>
            </div>

            <strong
              className="smallInfoBoxStatus"
              style={{
                color:
                  this.state.status == "pendente"
                    ? "#f18a33"
                    : this.state.status == "recusado"
                    ? "red"
                    : this.state.status == "operando"
                    ? "#52e899"
                    : "black",
              }}
            >
              {this.state.status}
            </strong>
          </div>
        </section>
      </main>
    );
  }
}
