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

  async getAllUsers() {
    const allUsers = await axios.get(
      "https://www.api.rangosemfila.com.br/v2/users",
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    return allUsers.data;
  }

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

  async filterUsers(input, param) {
    let result;
    param == "username"
      ? (result = await axios.get(
          `https://www.api.rangosemfila.com.br/v2/users?filters[username][$containsi]=${input}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        ))
      : (result = await axios.get(
          `https://www.api.rangosemfila.com.br/v2/users?filters[id][$eq]=${input}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        ));

    return result.data;
  }

  async findUser(userID) {
    const token = sessionStorage.getItem("token");

    const response = await axios.get(
      `https://www.api.rangosemfila.com.br/v2/users/${userID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }

  async updateUser(userID, body) {
    const response = await axios.put(
      `https://www.api.rangosemfila.com.br/v2/users/${userID}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
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

  async findRestaurant(id) {
    const response = await axios.get(
      `https://www.api.rangosemfila.com.br/v2/findRestaurant/${id}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
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

  async updateRestaurant(id, body) {
    const response = await axios.put(
      `https://api.rangosemfila.com.br/v2/restaurants/${id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    return response;
  }

  async filterRestaurants(input, param) {
    let result;
    param == "name"
      ? (result = await axios.get(
          `https://www.api.rangosemfila.com.br/v2/restaurants?filters[name][$containsi]=${input}`
        ))
      : (result = await axios.get(
          `https://www.api.rangosemfila.com.br/v2/restaurants?filters[id][$eq]=${input}`
        ));

    return result.data;
  }

  // COUPONS

  async getCoupons(offset, filters) {
    const response = await axios.get(
      `https://www.api.rangosemfila.com.br/v2/allCoupons/${offset}${
        filters != undefined ? filters : null
      }`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  }

  async newCoupon(body) {
    const response = await axios.post(
      "https://www.api.rangosemfila.com.br/v2/coupons",
      body,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  }

  // SUBACCOUNT

  async createSubaccount(body, restaurantId) {
    let response;

      response = await axios.post(
        `https://www.api.rangosemfila.com.br/v2/createSubAccount/${restaurantId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      console.log(response);
      return response;

  }

  async updatePaymentMethods() {}

  // NOTIFICATION

  async sendPushNotification(id, body) {
    const response = await axios.post(
      `https://www.api.rangosemfila.com.br/v2/sendPushNotification/${id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    console.log(response);
    return response;
  }

  async sendPushNotificationToAll(body) {
    const response = await axios.post(
      `https://www.api.rangosemfila.com.br/v2/sendPushNotificationToAll`,
      body,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    console.log(response);
    return response;
  }

  // MAILING

  async sendMail(body) {
    const response = await axios.post(
      "https://www.api.rangosemfila.com.br/v2/rangoMailer",
      body,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    return response;
  }
}

export { Services };
