import React from "react";
import "./Filter.scss";

import $ from "jquery";
import { Services } from "../services";
import axios from "axios";

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

      case "powerBiRestaurants":
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

      case "powerBiOrders":
        return (
          <div id="filterContent">
            <input type="number" id="orderId" name="id" placeholder="ID" />

            <input
              type="text"
              id="clientName"
              name="client"
              placeholder="Cliente"
            />

            <input
              type="text"
              id="restaurantName"
              name="restaurant"
              placeholder="Restaurante"
            />

            <input
              type="text"
              id="orderValue"
              name="subtotal"
              placeholder="Valor"
            />

            <select name="status">
              <option value="">Status</option>
              <option value="scheduled">Agendado</option>
              <option value="created">Criado</option>
              <option value="confirmed">Confirmado</option>
              <option value="ready">Pronto</option>
              <option value="delivered">Entregue</option>
              <option value="canceled">Cancelado</option>
            </select>

            <input type="date" name="dateStart" className="date" />

            <input type="date" name="dateEnd" className="date" />
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

    let form = $(".filter").serializeArray();
    form.forEach((element) => {
      if (element.value != "") {
        filters.push(element);
      }
    });

    if (filters.length > 0) {
      switch (target) {
        case "coupons":
          if (filters.length == 1) {
            url += `[${filters[0].name}][${
              filters[0].name == "name" ? "$containsi" : "$eq"
            }]=${filters[0].value}`;
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

        case "powerBiRestaurants":
          let powerBiRestaurantsForm = $(
            "#powerBiRestaurants"
          ).serializeArray();
          powerBiRestaurantsForm.forEach((element) => {
            if (element.value != "") {
              filters.push(element);
            }
          });

          if (filters.length == 1) {
            url += `[${filters[0].name}][${
              filters[0].name == "name" ? "$containsi" : "$eq"
            }]=${filters[0].value}`;
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

          console.log(url);

          const powerBiRestaurantsResponse =
            await services.getFilteredRestaurants(url);

          results = powerBiRestaurantsResponse;

          console.log(results);

          break;

        case "restaurants":
          let form = $("#restaurantsFilter").serializeArray();
          form.forEach((element) => {
            if (element.value != "") {
              filters.push(element);
            }
          });

          if (filters.length == 1) {
            url += `[${filters[0].name}][${
              filters[0].name == "name" ? "$containsi" : "$eq"
            }]=${filters[0].value}`;
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

          console.log(url);

          const restaurantsResponse = await services.getFilteredRestaurants(
            url
          );

          results = restaurantsResponse;

          console.log(results);

          break;

        case "powerBiOrders":
          const ordersForm = $("#powerBiOrdersFilter").serializeArray();
          ordersForm.forEach((element) => {
            if (element.value != "") {
              filters.push(element);
            }
          });

          if (filters.length == 1) {
            if (filters[0].name == "client") {
              url += `[user][username][$containsi]=${filters[0].value}`;
            } else if (filters[0].name == "restaurant") {
              url += `[restaurant][name][$containsi]=${filters[0].value}`;
            } else if (filters[0].name == "subtotal") {
              url += `[payment][subtotal][$eq]=${filters[0].value}`;
            } else if (filters[0].name == "dateStart") {
              const split = filters[0].value.split("-");
              const start = new Date(
                split[0],
                split[1] - 1,
                split[2],
                "21",
                "01"
              ).toISOString();

              url += `[createdAt][$gte]=${start}`;
            } else if (filters[0].name == "dateEnd") {
              const split = filters[0].value.split("-");
              const end = new Date(
                split[0],
                split[1] - 1,
                split[2],
                "20",
                "59"
              ).toISOString();

              url += `[createdAt][$lte]=${end}`;
            } else {
              url += `[${filters[0].name}][${
                filters[0].name == "name" ? "$containsi" : "$eq"
              }]=${filters[0].value}`;
            }
          } else {
            if (filters[0].name == "client") {
              url += `[user][username][$containsi][0]=${filters[0].value}`;
            } else if (filters[0].name == "restaurant") {
              url += `[restaurant][name][$containsi][0]=${filters[0].value}`;
            } else if (filters[0].name == "subtotal") {
              url += `[payment][subtotal][$eq][0]=${filters[0].value}`;
            } else if (filters[0].name == "dateStart") {
              const split = filters[0].value.split("-");
              const start = new Date(
                split[0],
                split[1] - 1,
                split[2],
                "21",
                "01"
              ).toISOString();

              url += `[createdAt][$gte][0]=${start}`;
            } else if (filters[0].name == "dateEnd") {
              const split = filters[0].value.split("-");
              const end = new Date(
                split[0],
                split[1] - 1,
                split[2],
                "20",
                "59"
              ).toISOString();

              url += `[createdAt][$lte][0]=${end}`;
            } else {
              url += `[${filters[0].name}][${
                filters[0].name == "name" ? "$containsi" : "$eq"
              }][0]=${filters[0].value}`;
            }

            for (var i = 1; i < filters.length; i++) {
              if (filters[i].name == "client") {
                url += `&filters[user][username][$containsi][${i}]=${filters[i].value}`;
              } else if (filters[i].name == "restaurant") {
                url += `&filters[restaurant][name][$containsi][${i}]=${filters[i].value}`;
              } else if (filters[i].name == "subtotal") {
                url += `&filters[payment][subtotal][$eq][${i}]=${filters[i].value}`;
              } else if (filters[i].name == "dateStart") {
                const split = filters[i].value.split("-");
                const start = new Date(
                  split[0],
                  split[1] - 1,
                  split[2],
                  "21",
                  "01"
                ).toISOString();

                url += `&filters[createdAt][$gte][${i}]=${start}`;
              } else if (filters[i].name == "dateEnd") {
                const split = filters[i].value.split("-");
                const end = new Date(
                  split[0],
                  split[1] - 1,
                  split[2],
                  "20",
                  "59"
                ).toISOString();

                url += `&filters[createdAt][$lte][${i}]=${end}`;
              } else {
                url += `&filters[${filters[i].name}][${
                  filters[i].name == "name" ? "$containsi" : "$eq"
                }][${i}]=${filters[i].value}`;
              }
            }
          }

          console.log(url);

          const ordersResponse = await axios.get(
            `https://api.rangosemfila.com.br/v2/orders${url}&populate=%2A`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            }
          );

          console.log(ordersResponse);

          results = ordersResponse.data.data.map((order) => {
            let obj = order.attributes;
            obj.id = order.id;
            obj.user = obj.user.data == null ? "N/A" : obj.user.data.attributes;
            obj.restaurant = obj.restaurant.data.attributes;

            return obj;
          });

          console.log(results);

          break;

        case "users":
          if (filters.length == 1) {
            url += `[${filters[0].name}][${
              filters[0].name == "username" ? "$containsi" : "$eq"
            }]=${filters[0].value}`;
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

      callback(results);
      $(".pagination").hide();
    }
  }

  return (
    <form
      className="filter"
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
