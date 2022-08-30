import React, { Component } from "react";
import Menu from "../components/Menu";

import "./RestaurantDetails.scss";

export default class RestaurantDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    sessionStorage.setItem("isMenuActive", false);
    const token = sessionStorage.getItem("token");

    if (!token) {
      $(".restaurantDetails").html("Not Authorized!!");
    }
  }

  render() {
    return (
      <main className="restaurantDetails">
        <Menu />

        
      </main>
    );
  }
}
