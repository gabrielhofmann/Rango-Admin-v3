import React from "react";
import "./Filter.scss";

import $ from "jquery";
import { Services } from "../services";

const services = new Services();

export default function Filter({ target, callback }) {
  const restaurantStatus = [
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

  function getFilterContent() {
    switch (target) {
      case "coupons":
        return (
          <div id="filterContent">
            <input type="number" id="couponId" name="id" placeholder="ID" />

            <input type="text" id="couponName" name="name" placeholder="Nome" />

            <select name="discountType" id="discountType">
              <option value="">Tipo de desconto</option>
              <option value="percentage">Porcentagem</option>
              <option value="value">Valor</option>
            </select>
          </div>
        );

      case "restaurants":
        return (
          <div id="filterContent">
            <input type="number" id="restaurantId" name="id" placeholder="ID" />

            <input
              type="text"
              id="restaurantName"
              name="name"
              placeholder="Nome"
            />

            <select name="category" id="category">
              <option value="">Categoria</option>

              {categories.map((category) => {
                return <option value={category}>{category}</option>;
              })}
            </select>

            <select name="status" id="status">
              <option value="">Status</option>

              {restaurantStatus.map((status) => {
                return <option value={status}>{status}</option>;
              })}
            </select>
          </div>
        );

      case "users":
        return (
          <div id="filterContent">
            <input type="number" id="userId" name="id" placeholder="ID" />

            <input
              type="text"
              id="userName"
              name="username"
              placeholder="Nome"
            />

            <input
              type="text"
              id="userEmail"
              name="email"
              placeholder="Email"
            />

            <input type="text" id="userCpf" name="cpf" placeholder="CPF" />
          </div>
        );

      default:
        break;
    }
  }

  async function handleFilterAction() {
    let results;
    let filters = new Array();
    let url = "?filters";

    let form = $("#filter").serializeArray();
    form.forEach((element) => {
      if (element.value != "") {
        filters.push(element);
      }
    });

    console.log(filters);

    if (filters.length > 0) {
      switch (target) {
        case "coupons":
          if (filters.length == 1) {
            url += `[${filters[0].name}][${
              filters[0].name == "name" ? "$containsi" : "$eq"
            }]=${filters[0].value}`;

            console.log(url);
          } else {
            url += `[${filters[0].name}][${
              filters[0].name == "name" ? "$containsi" : "$eq"
            }][0]=${filters[0].value}`;

            for (var i = 1; i < filters.length; i++) {
              url += `&filters[${filters[i].name}][${
                filters[i].name == "name" ? "$containsi" : "$eq"
              }][${i}]=${filters[i].value}`;
            }
          }

          const couponsResponse = await services.filterCoupons(url);

          results = couponsResponse;

          break;

        case "restaurants":
          if (filters.length == 1) {
            url += `[${filters[0].name}][${
              filters[0].name == "name" ? "$containsi" : "$eq"
            }]=${filters[0].value}`;

            console.log(url);
          } else {
            url += `[${filters[0].name}][${
              filters[0].name == "name" ? "$containsi" : "$eq"
            }][0]=${filters[0].value}`;

            for (var i = 1; i < filters.length; i++) {
              url += `&filters[${filters[i].name}][${
                filters[i].name == "name" ? "$containsi" : "$eq"
              }][${i}]=${filters[i].value}`;
            }
          }

          const restaurantsResponse = await services.getFilteredRestaurants(
            url
          );

          results = restaurantsResponse;

          break;

        case "users":
          if (filters.length == 1) {
            url += `[${filters[0].name}][${
              filters[0].name == "username" ? "$containsi" : "$eq"
            }]=${filters[0].value}`;

            console.log(url);
          } else {
            url += `[${filters[0].name}][${
              filters[0].name == "username" ? "$containsi" : "$eq"
            }][0]=${filters[0].value}`;

            for (var i = 1; i < filters.length; i++) {
              url += `&filters[${filters[i].name}][${
                filters[i].name == "username" ? "$containsi" : "$eq"
              }][${i}]=${filters[i].value}`;
            }
          }

          const usersResponse = await services.getAllUsers(url);

          results = usersResponse;

        default:
          break;
      }

      console.log(url);

      console.log(results);

      callback(results);

      document.getElementById("filter").reset();
    }
  }

  return (
    <form
      id="filter"
      onSubmit={(e) => {
        e.preventDefault();
        handleFilterAction();
      }}
    >
      {getFilterContent()}

      <button type="submit">Filtrar</button>
    </form>
  );
}
