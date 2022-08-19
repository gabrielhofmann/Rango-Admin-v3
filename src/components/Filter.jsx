import React, { Component } from "react";
import $ from "jquery";

import "./Filter.scss";
import axios from "axios";

const orderStatusList = [
  "scheduled",
  "created",
  "confirmed",
  "canceled",
  "ready",
  "delivered",
];

const restaurantStatusList = [
  "criado",
  "pendente",
  "confirmado",
  "operando",
  "recusado",
];

const categories = [
  "Açaí",
  "Africana",
  "Alemã",
  "Árabe",
  "Argentina",
  "Bebidas",
  "Brasileira",
  "Cafeteria",
  "Carnes",
  "Casa de Sucos",
  "Chinesa",
  "Colombiana",
  "Congelados",
  "Conveniência",
  "Coreana",
  "Doces e Bolos",
  "Espanhola",
  "Francesa",
  "Frutos do Mar",
  "Indiana",
  "Italiana",
  "Japonesa",
  "Lanches",
  "Marmita",
  "Mediterrânea",
  "Mexicana",
  "Padaria",
  "Pastel",
  "Peixes",
  "Peruana",
  "Pizza",
  "Portuguesa",
  "Salgados",
  "Saudável",
  "Sorvetes",
  "Tailandesa",
  "Vegetariana",
];

export default class Filter extends Component {
  constructor(props) {
    super(props);

    this.handleFilter = this.handleFilter.bind(this);
  }

  async handleFilter(e) {
    e.preventDefault();

    let results;

    const elements = $("input");
    $.merge(elements, $("select"));
    let inputData = [];
    let url = "?filters";
    let idString,
      userString,
      restaurantNameString,
      totalString,
      statusString,
      categoryString,
      dateString;

    elements.map((index, element) => {
      if (element.value.trim() != "") {
        switch (element.name) {
          case "id":
            idString = `[id][$eq]=${element.value}`;
            inputData.push({ name: element.name, value: idString });

            break;

          case "username":
            userString = `[user][username][$containsi]=${element.value}`;
            inputData.push({ name: element.name, value: userString });

            break;

          case "name":
            restaurantNameString = `[name][$containsi]=${element.value}`;
            inputData.push({ name: element.name, value: restaurantNameString });

            break;

          case "total":
            totalString = `[payment][total][$eq]=${element.value}`;
            inputData.push({ name: element.name, value: totalString });

            break;

          case "status":
            statusString = `[status][$eq]=${element.value}`;
            inputData.push({ name: element.name, value: statusString });

            break;

          case "category":
            categoryString = `[category][$eq]=${element.value}`;
            inputData.push({ name: element.name, value: categoryString });

            break;

          case "createdAt":
            dateString = `[createdAt][$eq]=${new Date(
              element.value
            ).toISOString()}`;
            inputData.push({ name: element.name, value: dateString });

            break;

          default:
            break;
        }
      }
    });

    if (inputData.length == 0) {
      if (this.props.target == "orders") {
        results = await axios.get(
          `https://staging.rangosemfila.com.br/v2/allOrders/0`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        this.props.callback(results.data[0]);
      } else {
        results = await axios.get(
          `https://staging.rangosemfila.com.br/v2/allRestaurants/0`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        this.props.callback(results.data[0]);
      }
    }

    if (inputData.length == 1) {
      url += `${inputData[0].value}`;
    } else {
      inputData.map((element, index) => {
        index == 0
          ? (url += `[and][0]${element.value}`)
          : (url += `&filters[and][${index}]${element.value}`);
      });
    }

    if (this.props.target == "orders") {
      results = await axios.get(
        `https://staging.rangosemfila.com.br/v2/findOrders${url}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
    } else if (this.props.target == "restaurants") {
      results = await axios.get(
        `https://staging.rangosemfila.com.br/v2/restaurants${url}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
    }

    this.props.callback(results.data);

    $("input").each(function (i, e) {
      $(e).val("");
    });

    $("select").each(function (i, e) {
      $(e).val("");
    });
  }
  render() {
    return (
      <main className="filterContainer">
        <div className="filter">
          <form id="filterForm" onSubmit={this.handleFilter}>
            <input type="text" placeholder="ID" name="id" />
            {this.props.target == "orders" ? (
              <input type="text" placeholder="Cliente" name="username" />
            ) : (
              <input type="text" placeholder="Nome" name="name" />
            )}
            {this.props.target == "orders" ? (
              <input type="text" placeholder="Valor" name="total" />
            ) : null}
            {this.props.target == "orders" ? (
              <select name="status" id="status">
                <option value="">Selecionar status</option>
                {orderStatusList.map((status) => {
                  return (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  );
                })}
              </select>
            ) : (
              <select name="category" id="category">
                <option value="">Selecionar categoria</option>
                {categories.map((category) => {
                  return (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  );
                })}
              </select>
            )}
            <input type="date" placeholder="Data" name="createdAt" />
            <button type="submit">
              <span className="material-symbols-rounded">search</span>
            </button>
          </form>
        </div>
      </main>
    );
  }
}
