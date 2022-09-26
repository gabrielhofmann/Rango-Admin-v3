import React, { Component } from "react";
import { Form, Spinner } from "react-bootstrap";
import Menu from "../components/Menu";
import { Services } from "../services";
import $ from "jquery";
import logo from "../assets/logo.svg";

import "./RestaurantDetails.scss";
import axios from "axios";

const services = new Services();

export default class RestaurantDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurant: {},
      billing: {},
      acquirer: {},
      legal: {},
      timing: [],
      totalRestaurantOrders: 0,
      anticipationEnabled: false,
      paymentMethods: [],
    };

    this.createsubAccount = this.createsubAccount.bind(this);
    this.handleEditCommission = this.handleEditCommission.bind(this);
    this.handleAutoAnticipation = this.handleAutoAnticipation.bind(this);
    this.handleScheduleAvailable = this.handleScheduleAvailable.bind(this);
    this.editPaymentMethods = this.editPaymentMethods.bind(this);
  }

  async componentDidMount() {
    sessionStorage.setItem("isMenuActive", false);
    const token = sessionStorage.getItem("token");

    if (!token) {
      $(".restaurantDetails").html("Not Authorized!!");
    } else {
      $(".loading").show();

      const restaurant = await services.findRestaurant(
        sessionStorage.getItem("restaurantId")
      );

      const data = await services.getPowerBiData();

      data.ordersPerRestaurant.forEach((e) => {
        if (e.restaurant.name == restaurant.name) {
          this.setState({ totalRestaurantOrders: e.orders });
        }
      });

      $(".restaurantDetails").on("click", () => {
        let active = sessionStorage.getItem("isMenuActive");

        if (active == "true") {
          services.handleMenuToggle();
        }
      });

      if (restaurant.status == "operando") {
        const anticipationData = await axios
          .get(
            "https://api.safe2pay.com.br/v2/PaymentMethod/Get?codePaymentMethod=2",
            {
              headers: {
                "x-api-key": restaurant.acquirer.apiToken,
              },
            }
          )
          .then((response) => {
            return response.data.ResponseDetail;
          });

        const paymentMethods = await axios
          .get("https://api.safe2pay.com.br/v2/PaymentMethod/List", {
            headers: {
              "x-api-key": restaurant.acquirer.apiToken,
            },
          })
          .then((response) => {
            return response.data.ResponseDetail;
          });

        this.setState({
          anticipationEnabled: anticipationData.IsImmediateAnticipation,
          paymentMethods: paymentMethods,
        });
      }

      this.setState({
        restaurant: restaurant,
        billing: restaurant.billing,
        acquirer: restaurant.acqurier,
        legal: restaurant.legal,
        timing: restaurant.timing,
      });

      $(".loading").hide();
    }
  }

  async createsubAccount() {
    $(".loading").show();

    const id = this.state.restaurant.id;
    const data = $("#subaccountForm").serializeArray();

    let body = {};

    data.map((el) => {
      body[el.name] = el.value;
    });

    const response = await services.createSubaccount(body, id);

    $(".loading").hide();
  }

  async handleEditCommission() {
    const [currentPlanElement, feePercentElements] = [
      $("#currentPlan"),
      $(".feePercent"),
    ];

    const currentPlan = currentPlanElement[0].value;
    const feePercent = feePercentElements.map((i, el) => {
      console.log(el);
      return {
        plan: el.name,
        fee: el.value,
      };
    });

    console.log(currentPlan, feePercent);
  }

  async handleAutoAnticipation() {
    $(".loading").show();

    const currentConfig = await axios
      .get(
        "https://api.safe2pay.com.br/v2/PaymentMethod/Get?codePaymentMethod=2",
        {
          headers: {
            "x-api-key": this.state.restaurant.acquirer.apiToken,
          },
        }
      )
      .then((response) => {
        return response.data.ResponseDetail;
      });

    const currentAnticipation = currentConfig.IsImmediateAnticipation;

    const updatedConfig = {
      ...currentConfig,
      IsImmediateAnticipation: !currentAnticipation,
    };

    await axios.put(
      "https://api.safe2pay.com.br/v2/PaymentMethod/Update",
      updatedConfig,
      {
        headers: {
          "x-api-key": this.state.restaurant.acquirer.apiToken,
        },
      }
    );

    $(".loading").hide();

    window.location.reload();
  }

  async handleScheduleAvailable() {
    $(".loading").show();

    await services.updateRestaurant(this.state.restaurant.id, {
      scheduleAvailable: !this.state.restaurant.scheduleAvailable,
    });

    $(".loading").hide();

    window.location.reload();
  }

  async editPaymentMethods() {
    $(".loading").show();

    const subaccountData = await axios.get(
      `https://api.safe2pay.com.br/v2/Marketplace/Get?id=${this.state.restaurant.acquirer.id}`,
      {
        headers: {
          "x-api-key": this.state.restaurant.acquirer.apiToken,
        },
      }
    );

    console.log(subaccountData);

    $(".loading").hide();

    // window.location.reload();
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
            <h1>{this.state.restaurant.name}</h1>
            <span className="material-symbols-rounded">store</span>
          </div>
        </div>

        <section className="restaurantDetailsContainer">
          <div className="restaurantDetailsHeader">
            <div className="nameAndImage">
              <div
                className="image"
                style={{
                  backgroundImage: `url(${
                    this.state.restaurant.thumbnailImageUrl
                      ? this.state.restaurant.thumbnailImageUrl
                      : logo
                  })`,
                }}
              ></div>

              <strong>
                <span>#ID {this.state.restaurant.id}</span>
                <br />
                {this.state.restaurant.name}
              </strong>
            </div>

            <div className="restaurantDetailsRow">
              {this.state.restaurant.status == "criado" ? (
                <div className="rowContent">
                  <div className="status">
                    <strong>
                      {this.state.restaurant.status.toUpperCase()}
                    </strong>
                  </div>

                  <button
                    className="sendToAnalysis"
                    onClick={async () => {
                      $(".loading").show();

                      await services.updateRestaurantStatus(
                        this.state.restaurant.id,
                        "pendente"
                      );

                      $(".loading").hide();

                      window.location.reload();
                    }}
                  >
                    Enviar para análise
                  </button>
                </div>
              ) : this.state.restaurant.status == "pendente" ? (
                <div className="rowContent">
                  <div className="status">
                    <strong>
                      {this.state.restaurant.status.toUpperCase()}
                    </strong>
                  </div>

                  <button
                    className="confirm actionButton"
                    onClick={async () => {
                      $(".loading").show();

                      await services.updateRestaurantStatus(
                        this.state.restaurant.id,
                        "confirmado"
                      );

                      $(".loading").hide();

                      window.location.reload();
                    }}
                  >
                    CONFIRMAR
                  </button>

                  <button
                    className="refuse actionButton"
                    onClick={async () => {
                      $(".loading").show();

                      await services.updateRestaurantStatus(
                        this.state.restaurant.id,
                        "recusado"
                      );

                      $(".loading").hide();

                      window.location.reload();
                    }}
                  >
                    RECUSAR
                  </button>
                </div>
              ) : this.state.restaurant.status == "operando" ? (
                <div className="rowContent">
                  <div className="status">
                    <strong style={{ color: "#52E899" }}>
                      {this.state.restaurant.status.toUpperCase()}
                    </strong>
                  </div>

                  <div className="rating">
                    <div className="icons">
                      {this.state.restaurant.rating > 0 ? (
                        this.state.restaurant.rating
                      ) : (
                        <strong>-</strong>
                      )}
                    </div>

                    <p>Avaliação</p>
                  </div>

                  <div className="orders">
                    <strong>{this.state.totalRestaurantOrders}</strong>
                    <br />

                    <div id="row">
                      <span className="material-symbols-rounded restaurantIcon">
                        list_alt
                      </span>
                      <span>Pedidos</span>
                    </div>
                  </div>

                  <div
                    className="isOpen"
                    style={{
                      backgroundColor: this.state.restaurant.isOpen
                        ? "#52E899"
                        : "#E4420F",
                    }}
                  >
                    <strong>
                      {this.state.restaurant.isOpen ? "ABERTO" : "FECHADO"}
                    </strong>
                  </div>
                </div>
              ) : (
                <div className="rowContent">
                  <div className="status" style={{ margin: "auto" }}>
                    <strong>{this.state.restaurant.status}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {this.state.restaurant.status == "operando" &&
          this.state.restaurant.acquirer != undefined ? (
            <div className="pageContentWrapper">
              <div className="leftContainer">
                <div className="row1">
                  <div className="card">
                    <p>Telefone:</p>

                    <strong>{this.state.restaurant.phoneNumber}</strong>
                  </div>

                  <div className="card">
                    <p>Categoria:</p>

                    <strong>{this.state.restaurant.category}</strong>
                  </div>

                  <div className="card">
                    <p>RanGo maior do mundo:</p>

                    <strong>Sim</strong>
                  </div>
                </div>

                <div className="row2">
                  <ul>
                    {this.state.timing.map((el) => {
                      return (
                        <li key={el.weekDay}>
                          <p>{el.weekDay}</p>

                          <div>
                            <strong>
                              {el.openingTime} - {el.closingTime}
                            </strong>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="accountInfo">
                    <div>
                      <p>Nome do Banco</p>

                      <strong>{this.state.billing.bank}</strong>
                    </div>

                    <div>
                      <div>
                        <p>Código do Banco</p>

                        <strong>
                          {this.state.billing.bankCode
                            ? this.state.billing.bankCode
                            : "N/A"}
                        </strong>
                      </div>

                      <div>
                        <p>Agência</p>

                        <strong>{this.state.billing.agency}</strong>
                      </div>
                    </div>

                    <div>
                      <p>Conta</p>

                      <strong>{this.state.billing.account}</strong>
                    </div>
                  </div>
                </div>

                <div className="row3">
                  <div>
                    <div>
                      <p>
                        Razão Social
                        <br />
                        <strong>{this.state.legal.razaoSocial}</strong>
                      </p>
                    </div>

                    <div>
                      <p>
                        CNPJ
                        <br />
                        <strong>{this.state.legal.cnpj}</strong>
                      </p>
                    </div>
                  </div>

                  <div>
                    <p>
                      Nome fantasia
                      <br />
                      <strong>
                        {this.state.legal.nomeFantasia
                          ? this.state.legal.nomeFantasia
                          : "N/A"}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="rightContainer">
                <div className="row1">
                  <div id="commissionRow">
                    <div className="currentPlan">
                      <p>
                        <b style={{ color: "grey" }}>Plano atual:</b>
                      </p>

                      <select
                        name="currentPlan"
                        id="currentPlan"
                        onChange={async (e) => {
                          $(".loading").show();

                          let planCode;
                          const restaurantToken =
                            this.state.restaurant.acquirer.apiToken;

                          const acquirer = {
                            acquirer: {
                              ...this.state.restaurant.acquirer,
                              currentPlan: e.target.value,
                            },
                          };

                          switch (e.target.value) {
                            case "daily":
                              planCode = "7";

                              break;

                            case "weekly":
                              planCode = "6";

                              break;

                            case "monthly":
                              planCode = "1";

                              break;

                            default:
                              break;
                          }

                          await services.updateRestaurant(
                            this.state.restaurant.id,
                            acquirer
                          );

                          await axios.put(
                            "https://api.safe2pay.com.br/v2/MerchantPaymentDate/Update",
                            {
                              PlanFrequence: {
                                Code: planCode,
                              },
                            },
                            {
                              headers: {
                                "x-api-key": restaurantToken,
                              },
                            }
                          );

                          $(".loading").hide();

                          window.location.reload();
                        }}
                      >
                        <option
                          value={this.state.restaurant.acquirer.currentPlan}
                        >
                          {this.state.restaurant.acquirer.currentPlan}
                        </option>
                        {this.state.restaurant.acquirer.commission.map((el) => {
                          if (
                            el.commissionPlan !=
                            this.state.restaurant.acquirer.currentPlan
                          ) {
                            return (
                              <option value={el.commissionPlan}>
                                {el.commissionPlan}
                              </option>
                            );
                          }
                        })}
                      </select>
                    </div>

                    <div className="commission">
                      <ul>
                        {this.state.restaurant.acquirer.commission.map((el) => {
                          return (
                            <li key={el.commissionPlan}>
                              <strong>{el.commissionPlan}</strong>

                              <input
                                className="feePercent"
                                name={el.commissionPlan}
                                type="text"
                                defaultValue={el.feePercent}
                              />
                            </li>
                          );
                        })}

                        <strong
                          id="toggleEditMode"
                          onClick={() => {
                            $("#toggleEditMode").hide();
                            $("#saveButton").show();
                          }}
                        >
                          Editar
                        </strong>

                        <button
                          id="saveButton"
                          onClick={this.handleEditCommission}
                        >
                          Salvar
                        </button>
                      </ul>
                    </div>
                  </div>

                  <div className="autoAnticipation">
                    <div
                      id="anticipationSwitch"
                      className="switch"
                      onClick={this.handleAutoAnticipation}
                      style={{
                        backgroundColor: this.state.anticipationEnabled
                          ? "#52e899"
                          : null,
                        flexDirection: this.state.anticipationEnabled
                          ? "row-reverse"
                          : null,
                      }}
                    >
                      <div className="ball"></div>
                    </div>

                    <p>
                      <b style={{ color: "grey", textAlign: "center" }}>
                        Antecipação automática
                      </b>
                    </p>
                  </div>
                </div>

                <div className="row2">
                  <strong>
                    R${this.state.restaurant.minimumOrderValue}
                    <br />
                    <p>Pedido Mínimo</p>
                  </strong>

                  <strong>
                    {this.state.restaurant.estimatedDeliveryTime} minutos
                    <br />
                    <p>Tempo de entrega médio</p>
                  </strong>

                  <div className="scheduleAvailable">
                    <div
                      id="scheduleSwitch"
                      style={{
                        backgroundColor: this.state.restaurant.scheduleAvailable
                          ? "#52e899"
                          : null,
                        flexDirection: this.state.restaurant.scheduleAvailable
                          ? "row-reverse"
                          : null,
                      }}
                      onClick={this.handleScheduleAvailable}
                      className="switch"
                    >
                      <div className="ball"></div>
                    </div>

                    <p>Aceita Agendamento</p>
                  </div>
                </div>

                <div className="row3">
                  <div>
                    <p>
                      CEP: <br />
                      <strong>{this.state.restaurant.address.cep}</strong>
                    </p>

                    <p>
                      Estado: <br />
                      <strong>{this.state.restaurant.address.state}</strong>
                    </p>

                    <p>
                      Cidade: <br />
                      <strong>{this.state.restaurant.address.city}</strong>
                    </p>

                    <p>
                      Bairro: <br />
                      <strong>
                        {this.state.restaurant.address.neighborhood}
                      </strong>
                    </p>
                  </div>

                  <p>
                    Endereço completo: <br />
                    <strong>
                      {this.state.restaurant.address.address} <br />{" "}
                      {this.state.restaurant.address.complement}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          ) : this.state.restaurant.status == "confirmado" ? (
            <div className="confirmedContainer">
              <h1>Criar subconta</h1>

              <Form id="subaccountForm">
                <Form.Group>
                  <Form.Label>Taxa antecipação</Form.Label>
                  <Form.Control
                    name="antecipationTax"
                    type="number"
                    step={0.01}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Taxa crédito</Form.Label>
                  <Form.Control
                    name="creditTax"
                    type="number"
                    step={0.01}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Taxa débito</Form.Label>
                  <Form.Control
                    name="debitTax"
                    type="number"
                    step={0.01}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Taxa PIX</Form.Label>
                  <Form.Control
                    name="pixTax"
                    type="number"
                    step={0.01}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Taxa crypto</Form.Label>
                  <Form.Control
                    name="cryptoTax"
                    type="number"
                    step={0.01}
                    required
                  />
                </Form.Group>
              </Form>

              <button onClick={this.createsubAccount}>Enviar</button>
            </div>
          ) : null}
        </section>

        {this.state.restaurant.status == "operando" ? (
          <section className="paymentMethodsContainer">
            <h2>Formas de pagamento</h2>

            <ul>
              {this.state.paymentMethods.map((el) => {
                return (
                  <li className="paymentMethodCard" key={el.PaymentMethod.Name}>
                    <strong>{el.PaymentMethod.Name}</strong>

                    <input
                      name={el.PaymentMethod.Code}
                      onChange={(e) => {
                        $("#editPaymentMethodTaxButton").addClass("active");

                        this.setState({
                          selectedPaymentMethod: {
                            code: el.PaymentMethod.Code,
                            tax: e.target.value,
                          },
                        });
                      }}
                      className="paymentMethodTax"
                      type="number"
                      step={0.01}
                      defaultValue={el.Tax[0].Amount}
                    />
                  </li>
                );
              })}
            </ul>

            <button
              id="editPaymentMethodTaxButton"
              onClick={this.editPaymentMethods}
            >
              Salvar
            </button>
          </section>
        ) : null}
      </main>
    );
  }
}
