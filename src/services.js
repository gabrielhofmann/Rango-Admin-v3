import axios from "axios";
import $ from "jquery";

class Services {
  constructor() {
    this.localhost = "http://localhost:1337/v2";
    this.staging = "https://staging.rangosemfila.com.br/v2";
    this.production = "https://api.rangosemfila.com.br/v2";
  }

  // COMPONENTS BEHAVIOR

  handleMenuToggle() {
    let width;
    let screenWidth = window.innerWidth;

    screenWidth <= 1024
      ? (width = "70")
      : screenWidth <= 1400
      ? (width = "30")
      : (width = "20");

    if (
      sessionStorage.getItem("isMenuActive") == "false" ||
      !sessionStorage.getItem("isMenuActive")
    ) {
      setTimeout(() => $("nav").show(), 200);
      $(".menu").css("width", `${width}vw`);

      sessionStorage.setItem("isMenuActive", true);
    } else {
      $(".menuNav").hide();
      $(".menu").css("width", 0);

      sessionStorage.setItem("isMenuActive", false);
    }
  }

  // LOGIN AND REGISTER

  async login(identifier, password) {
    try {
      const response = await axios.post(this.staging + "/auth/local", {
        identifier: identifier,
        password: password,
      });

      return {
        message: `${response.status}`,
        jwt: response.data.jwt,
      };
    } catch (error) {
      return {
        message: "erro",
      };
    }
  }

  async register(username, email, cpf, phoneNumber, password) {}

  // POWERBI

  async getPowerBiData() {
    const response = await axios.get(
      "https://staging.rangosemfila.com.br/v2/getPowerBiData",
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  }

  // USERS

  async getUsers(offset) {
    try {
      const response = await axios.get(
        `https://staging.rangosemfila.com.br/v2/allUsers/${offset}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      return {
        users: response.data[0],
        count: response.data[1],
      };
    } catch (e) {
      console.error(e);
    }
  }

  // ORDERS

  async getOrders(offset) {
    try {
      const response = await axios.get(
        `https://staging.rangosemfila.com.br/v2/allOrders/${offset}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      return {
        orders: response.data[0],
        count: response.data[1],
      };
    } catch (e) {
      console.error(e);
    }
  }

  // RESTAURANTS

  async getRestaurants(offset) {
    try {
      const response = await axios.get(
        `https://staging.rangosemfila.com.br/v2/allRestaurants/${offset}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      return {
        restaurants: response.data[0],
        count: response.data[1],
      };
    } catch (e) {
      console.error(e);
    }
  }
}

export { Services };
