import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
import { Services } from "../services";
import $ from "jquery";
import "./OneSignal.scss";
import Menu from "../components/Menu";

const services = new Services();

export default class OneSignal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    sessionStorage.setItem("isMenuActive", false);
    const token = sessionStorage.getItem("token");
    $(".loading").show();

    if (!token) {
      $(".loading").hide();
      $(".coupons").html("Not Authorized!!");
    } else {
      $(".oneSignal").on("click", () => {
        let active = sessionStorage.getItem("isMenuActive");

        if (active == "true") {
          services.handleMenuToggle();
        }
      });

      $(".loading").hide();
    }
  }

  render() {
    return (
      <main className="oneSignal">
        <Menu />

        <div className="loading">
          <Spinner className="spinner" animation="border" />
        </div>

        <div className="pageHeader">
          <div className="menuToggle" onClick={services.handleMenuToggle}>
            <span className="material-symbols-rounded">menu</span>
          </div>

          <div className="pageTitle">
            <h1>One Signal</h1>
            <span className="material-symbols-rounded">
              radio_button_checked
            </span>
          </div>
        </div>
      </main>
    );
  }
}
