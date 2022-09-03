import axios from "axios";
import $ from "jquery";

class Services {
  constructor() {
    this.localhost = "http://localhost:1337/v2";
    this.api = "https://www.api.rangosemfila.com.br/v2";
    this.production = "https://www.api.rangosemfila.com.br/v2";
  }

  // COMPONENTS BEHAVIOR

  handleMenuToggle() {
    let width;
    let screenWidth = window.innerWidth;
    let currentState = sessionStorage.getItem("isMenuActive");

    screenWidth <= 1024
      ? (width = "70")
      : screenWidth <= 1400
      ? (width = "30")
      : (width = "20");

    if (currentState == "false") {
      sessionStorage.setItem("isMenuActive", true);

      setTimeout(() => $("nav").show(), 330);
      $(".menu").css("width", `${width}vw`);

      return;
    } else {
      sessionStorage.setItem("isMenuActive", false);

      $(".menuNav").hide();
      $(".menu").css("width", 0);

      return;
    }
  }

  // LOGIN AND REGISTER

  async login(identifier, password) {
    try {
      const response = await axios.post(this.production + "/auth/local", {
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
      "https://www.api.rangosemfila.com.br/v2/getPowerBiData",
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
        `https://www.api.rangosemfila.com.br/v2/allUsers/${offset}`,
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
        `https://www.api.rangosemfila.com.br/v2/allOrders/${offset}`,
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
        `https://www.api.rangosemfila.com.br/v2/allRestaurants/${offset}`,
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

  async updateRestaurantStatus(id, status) {
    const response = await axios.put(
      `https://api.rangosemfila.com.br/v2/restaurants/${id}`,
      { status: status },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  }
}

export { Services };
