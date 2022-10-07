import React, { Component } from "react";
import { Alert, Form, Spinner } from "react-bootstrap";
import Menu from "../components/Menu";
import { Services } from "../services";
import $ from "jquery";
import logo from "../assets/logo.svg";

import "./RestaurantDetails.scss";
import axios from "axios";

const services = new Services();
const apiToken = "CAC313AA12A44B5783CF26D60B664804";

export default class RestaurantDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurant: {},
      bankData: {},

      timing: [],
      totalRestaurantOrders: 0,
      anticipationEnabled: false,
      paymentMethods: [],
      restaurantOwner: {},
      currentPlanTaxChanged: false,

      showErrorAlert: false,
      errorText: "",
    };

    this.createsubAccount = this.createsubAccount.bind(this);
    this.handleAutoAnticipation = this.handleAutoAnticipation.bind(this);
    this.handleScheduleAvailable = this.handleScheduleAvailable.bind(this);
    this.handleEditBilling = this.handleEditBilling.bind(this);
    this.handleEditTaxes = this.handleEditTaxes.bind(this);
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

      console.log(restaurant);

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

        let subaccountData = await axios
          .get(
            `https://api.safe2pay.com.br/v2/Marketplace/Get?id=${restaurant.acquirer.accountId}`,
            {
              headers: {
                "x-api-key": apiToken,
              },
            }
          )
          .then((response) => {
            return response.data.ResponseDetail;
          });

        this.setState({
          anticipationEnabled: anticipationData.IsImmediateAnticipation,
          paymentMethods: paymentMethods,
          bankData: subaccountData.BankData,
        });
      }

      const restaurantOwner = await axios.get(
        `https://www.api.rangosemfila.com.br/v2/users?filters[restaurants][id]=${restaurant.id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      console.log(restaurantOwner.data[0]);

      this.setState({
        restaurant: restaurant,
        billing: restaurant.billing,
        acquirer: restaurant.acqurier,
        legal: restaurant.legal,
        timing: restaurant.timing,
        restaurantOwner: restaurantOwner.data[0],
      });

      $(".loading").hide();
    }
  }

  async handleEditBilling() {
    $(".loading").show();

    let body = {};

    const inputs = $("#billing").serializeArray();

    inputs.forEach((el) => {
      if (el.name == "Bank" || el.name == "AccountType") {
        body[el.name] = {
          Code: el.value,
        };
      } else {
        body[el.name] = el.value;
      }
    });

    body = {
      BankData: {
        ...body,
      },
    };
    console.log(body);

    try {
      const response = await axios.put(
        `https://api.safe2pay.com.br/v2/Marketplace/Update?id=${this.state.restaurant.acquirer.accountId}`,
        body,
        {
          headers: {
            "x-api-key": apiToken,
          },
        }
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
    }

    $(".loading").hide();

    // window.location.reload();
  }

  async createsubAccount() {
    $(".loading").show();

    const id = this.state.restaurant.id;
    const data = $("#subaccountForm").serializeArray();

    let body = {};

    data.map((el) => {
      body[el.name] = el.value;
    });

    try {
      const response = await services.createSubaccount(body, id);

      console.log(response);
      window.location.reload();
    } catch (error) {
      console.error(error);

      this.setState({
        showErrorAlert: true,
        errorText: "Erro ao criar subconta, verifique os dados cadastrados.",
      });

      $(".loading").hide();
    }
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

  async handleEditTaxes() {
    $(".loading").show();

    let [daily, weekly, monthly] = [
      $("#daily")[0].value,
      $("#weekly")[0].value,
      $("#monthly")[0].value,
    ];

    let currentPlanTax;
    switch (this.state.restaurant.acquirer.currentPlan) {
      case "daily":
        currentPlanTax = daily;

        break;

      case "weekly":
        currentPlanTax = weekly;

        break;

      case "monthly":
        currentPlanTax = monthly;

        break;

      default:
        break;
    }

    let updatedCommission = this.state.restaurant.acquirer.commission.map(
      (el) => {
        switch (el.commissionPlan) {
          case "daily":
            return {
              ...el,
              feePercent: daily,
            };

          case "weekly":
            return {
              ...el,
              feePercent: weekly,
            };

          case "monthly":
            return {
              ...el,
              feePercent: monthly,
            };

          default:
            break;
        }
      }
    );

    const body = {
      acquirer: {
        ...this.state.restaurant.acquirer,
        commission: updatedCommission,
      },
    };

    const response = await services.updateRestaurant(
      this.state.restaurant.id,
      body
    );

    if (this.state.currentPlanTaxChanged) {
      let subaccountData = await axios
        .get(
          `https://api.safe2pay.com.br/v2/Marketplace/Get?id=${this.state.restaurant.acquirer.accountId}`,
          {
            headers: {
              "x-api-key": apiToken,
            },
          }
        )
        .then((response) => {
          return response.data.ResponseDetail;
        });

      console.log(subaccountData);

      const MerchantSplit = subaccountData.PaymentMethods.map((el) => {
        if (el.PaymentMethod == "15") {
          return {
            PaymentMethodCode: el.PaymentMethod,
            IsSubaccountTaxPayer: el.IsPayTax,
            Taxes: [
              {
                TaxTypeName: "1",
                Tax: "2.5",
              },
            ],
          };
        } else {
          return {
            PaymentMethodCode: el.PaymentMethod,
            IsSubaccountTaxPayer: el.IsPayTax,
            Taxes: [
              {
                TaxTypeName: "1",
                Tax: currentPlanTax,
              },
            ],
          };
        }
      });

      subaccountData = {
        MerchantSplit: MerchantSplit,
      };

      console.log(MerchantSplit);

      const response = await axios.put(
        `https://api.safe2pay.com.br/v2/Marketplace/Update?id=${this.state.restaurant.acquirer.accountId}`,
        subaccountData,
        {
          headers: {
            "x-api-key": apiToken,
          },
        }
      );

      console.log(response);
    }

    $(".loading").hide();

    window.location.reload();
  }

  render() {
    return (
      <main className="restaurantDetails">
        <Menu />

        <Alert
          variant="danger"
          id="errorAlert"
          onClose={() => {
            this.setState({ showErrorAlert: false });
          }}
          show={this.state.showErrorAlert}
          dismissible
        >
          {this.state.errorText}
        </Alert>

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
                    <p>Email:</p>

                    <strong>{this.state.restaurantOwner.email}</strong>
                  </div>

                  <div className="card">
                    <p>Proprietário:</p>

                    <strong>{this.state.restaurantOwner.username}</strong>
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
                    <strong
                      id="saveAccountBilling"
                      onClick={this.handleEditBilling}
                    >
                      Salvar
                    </strong>

                    <Form id="billing">
                      <Form.Group className="accountInfoGroup">
                        <Form.Label>Operação</Form.Label>

                        <select
                          name="Operation"
                          id="operationSelect"
                          onChange={() => {
                            $("#saveAccountBilling").show();
                          }}
                        >
                          <option value="003">
                            Conta Corrente de Pessoa Jurídica
                          </option>
                          <option value="022">
                            Poupança de Pessoa Jurídica
                          </option>
                        </select>
                      </Form.Group>

                      <Form.Group className="accountInfoGroup">
                        <Form.Label>Agência</Form.Label>

                        <div className="inputRow">
                          <input
                            name="BankAgency"
                            type="text"
                            defaultValue={this.state.bankData.Agency}
                            onChange={() => {
                              $("#saveAccountBilling").show();
                            }}
                          />

                          <input
                            name="BankAgencyDigit"
                            type="text"
                            defaultValue={this.state.bankData.AgencyDigit}
                            onChange={() => {
                              $("#saveAccountBilling").show();
                            }}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="accountInfoGroup">
                        <Form.Label>Conta</Form.Label>

                        <div className="inputRow">
                          <input
                            name="BankAccount"
                            type="text"
                            defaultValue={this.state.bankData.Account}
                            onChange={() => {
                              $("#saveAccountBilling").show();
                            }}
                          />

                          <input
                            name="BankAccountDigit"
                            type="text"
                            defaultValue={this.state.bankData.AccountDigit}
                            onChange={() => {
                              $("#saveAccountBilling").show();
                            }}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="accountInfoGroup">
                        <Form.Label>Código do Banco</Form.Label>

                        <input
                          name="Bank"
                          type="text"
                          defaultValue={this.state.bankData.Bank}
                          onChange={() => {
                            $("#saveAccountBilling").show();
                          }}
                        />
                      </Form.Group>

                      <Form.Group className="accountInfoGroup">
                        <Form.Label>Tipo de Conta</Form.Label>

                        <select
                          name="AccountType"
                          id="accountTypeSelect"
                          onChange={() => {
                            $("#saveAccountBilling").show();
                          }}
                        >
                          <option value="CC">Conta Corrente</option>
                          <option value="PP">Poupança</option>
                        </select>
                      </Form.Group>
                    </Form>
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

                          let [daily, weekly, monthly] = [
                            $("#daily")[0].value,
                            $("#weekly")[0].value,
                            $("#monthly")[0].value,
                          ];

                          let planCode;
                          let planTax;

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
                              planTax = daily;

                              break;

                            case "weekly":
                              planCode = "6";
                              planTax = weekly;

                              break;

                            case "monthly":
                              planCode = "1";
                              planTax = monthly;

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

                          let subaccountData = await axios
                            .get(
                              `https://api.safe2pay.com.br/v2/Marketplace/Get?id=${this.state.restaurant.acquirer.accountId}`,
                              {
                                headers: {
                                  "x-api-key": apiToken,
                                },
                              }
                            )
                            .then((response) => {
                              return response.data.ResponseDetail;
                            });

                          console.log(subaccountData);

                          const MerchantSplit =
                            subaccountData.PaymentMethods.map((el) => {
                              if (el.PaymentMethod == "15") {
                                return {
                                  PaymentMethodCode: el.PaymentMethod,
                                  IsSubaccountTaxPayer: el.IsPayTax,
                                  Taxes: [
                                    {
                                      TaxTypeName: "1",
                                      Tax: "2.5",
                                    },
                                  ],
                                };
                              } else {
                                return {
                                  PaymentMethodCode: el.PaymentMethod,
                                  IsSubaccountTaxPayer: el.IsPayTax,
                                  Taxes: [
                                    {
                                      TaxTypeName: "1",
                                      Tax: planTax,
                                    },
                                  ],
                                };
                              }
                            });

                          subaccountData = {
                            MerchantSplit: MerchantSplit,
                          };

                          console.log(MerchantSplit);

                          const response = await axios.put(
                            `https://api.safe2pay.com.br/v2/Marketplace/Update?id=${this.state.restaurant.acquirer.accountId}`,
                            subaccountData,
                            {
                              headers: {
                                "x-api-key": apiToken,
                              },
                            }
                          );

                          console.log(response);

                          if (planCode != "1") {
                            const currentConfig = await axios
                              .get(
                                "https://api.safe2pay.com.br/v2/PaymentMethod/Get?codePaymentMethod=2",
                                {
                                  headers: {
                                    "x-api-key":
                                      this.state.restaurant.acquirer.apiToken,
                                  },
                                }
                              )
                              .then((response) => {
                                return response.data.ResponseDetail;
                              });

                            const currentAnticipation =
                              currentConfig.IsImmediateAnticipation;

                            const updatedConfig = {
                              ...currentConfig,
                              IsImmediateAnticipation: true,
                            };

                            await axios.put(
                              "https://api.safe2pay.com.br/v2/PaymentMethod/Update",
                              updatedConfig,
                              {
                                headers: {
                                  "x-api-key":
                                    this.state.restaurant.acquirer.apiToken,
                                },
                              }
                            );

                            $(".loading").hide();

                            window.location.reload();
                          } else {
                            const currentConfig = await axios
                              .get(
                                "https://api.safe2pay.com.br/v2/PaymentMethod/Get?codePaymentMethod=2",
                                {
                                  headers: {
                                    "x-api-key":
                                      this.state.restaurant.acquirer.apiToken,
                                  },
                                }
                              )
                              .then((response) => {
                                return response.data.ResponseDetail;
                              });

                            const currentAnticipation =
                              currentConfig.IsImmediateAnticipation;

                            const updatedConfig = {
                              ...currentConfig,
                              IsImmediateAnticipation: false,
                            };

                            await axios.put(
                              "https://api.safe2pay.com.br/v2/PaymentMethod/Update",
                              updatedConfig,
                              {
                                headers: {
                                  "x-api-key":
                                    this.state.restaurant.acquirer.apiToken,
                                },
                              }
                            );

                            $(".loading").hide();

                            window.location.reload();
                          }
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
                                id={el.commissionPlan}
                                className="feePercent"
                                name={el.commissionPlan}
                                type="text"
                                defaultValue={el.feePercent}
                                onChange={() => {
                                  if (
                                    el.commissionPlan ==
                                    this.state.restaurant.acquirer.currentPlan
                                  ) {
                                    this.setState({
                                      currentPlanTaxChanged: true,
                                    });
                                  }
                                  $("#saveTaxes").show();
                                }}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <strong onClick={this.handleEditTaxes} id="saveTaxes">
                      Salvar
                    </strong>
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

                    <p style={{ textAlign: "center" }}>
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
                  <Form.Label>Plano</Form.Label>
                  <Form.Select name="currentPlan" required>
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Taxa diário</Form.Label>
                  <Form.Control
                    name="dailyTax"
                    type="number"
                    step={0.01}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Taxa semanal</Form.Label>
                  <Form.Control
                    name="weeklyTax"
                    type="number"
                    step={0.01}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Taxa mensal</Form.Label>
                  <Form.Control
                    name="monthlyTax"
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
      </main>
    );
  }
}
