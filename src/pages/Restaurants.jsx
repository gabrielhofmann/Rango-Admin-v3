import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
import Menu from "../components/Menu";
import { Services } from "../services";
import $ from "jquery";
import Pagination from "../components/Pagination";
import logo from "../assets/logo.svg";

import "./Restaurants.scss";
import Filter from "../components/Filter";

const services = new Services();

export default class Restaurants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurants: [],
    };

    this.setRestaurants = this.setRestaurants.bind(this);
  }

  async componentDidMount() {
    $(".loading").show();

    const restaurants = await services.getRestaurants(0);

    this.setState({ restaurants: restaurants.restaurants });

    $(".loading").hide();
  }

  setRestaurants = (results) => {
    this.setState({ restaurants: results });
  };

  render() {
    return (
      <main className="restaurants">
        <Menu />

        <Pagination target="restaurants" callback={this.setRestaurants} />

        <div className="loading">
          <Spinner className="spinner" animation="border" />
        </div>

        <div className="pageHeader">
          <div className="menuToggle" onClick={services.handleMenuToggle}>
            <span className="material-symbols-rounded">menu</span>
          </div>

          <div className="pageTitle">
            <h1>Restaurantes</h1>
            <span className="material-symbols-rounded">monitoring</span>
          </div>
        </div>

        <Filter
          id="restaurantsPageFilter"
          target="restaurants"
          callback={this.setRestaurants}
        />

        <section className="pageContainer restaurantsContainer">
          <ul>
            {this.state.restaurants.map((restaurant) => {
              return (
                <li key={restaurant.id}>
                  <div className="restaurantCardHeader">
                    <strong>
                      {`${restaurant.name}`}
                      <br />
                      <span>{`#ID ${restaurant.id}`}</span>
                    </strong>

                    <div
                      className="restaurantCardImage"
                      style={{
                        backgroundImage: restaurant.thumbnailImageUrl
                          ? `url(${restaurant.thumbnailImageUrl})`
                          : `url(${logo})`,
                      }}
                    ></div>
                  </div>

                  <div className="restaurantCardBody">
                    <ul>
                      <li key="contato">
                        <strong>Contato</strong>

                        <p>{restaurant.phoneNumber}</p>
                      </li>

                      <li key="status">
                        <strong>Status</strong>

                        <p>{restaurant.status}</p>
                      </li>
                    </ul>
                  </div>

                  <div className="restaurantCardFooter">
                    <a href="">Ver mais</a>

                    {restaurant.status == "criado" ? (
                      <button>Enviar para avaliação</button>
                    ) : restaurant.status == "pendente" ? (
                      <div className="restaurantCardButtonsRow">
                        <button>Confirmar</button>

                        <button>Recusar</button>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    );
  }
}
