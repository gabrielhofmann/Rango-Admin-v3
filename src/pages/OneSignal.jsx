import React, { Component } from "react";
import { FloatingLabel, Form, Spinner } from "react-bootstrap";
import { Services } from "../services";
import $ from "jquery";
import "./OneSignal.scss";
import Menu from "../components/Menu";
import Select from "react-select";
import EmojiPicker from "emoji-picker-react";

const services = new Services();

export default class OneSignal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      message: "",
      selectedUser: "",
      selectedZone: "",
      usersOptions: [],
      showTitleEmoji: false,
      showMessageEmoji: false,
      zones: [],
    };

    this.sendNotification = this.sendNotification.bind(this);
  }

  async componentDidMount() {
    sessionStorage.setItem("isMenuActive", false);
    const token = sessionStorage.getItem("token");

    if (!token) {
      $(".coupons").html("Not Authorized!!");
    } else {
      const users = await services.getUsers(0);
      let zones = await services.getZones();

      zones = zones.data.map((zone) => {
        return {
          label: zone.attributes.name,
          value: zone.attributes.name,
        };
      });

      const usersOptions = users.users.map((user) => {
        return {
          label: user.username,
          value: user.id,
        };
      });

      document
        .getElementById("userSelect")
        .querySelector(".select__input")
        .addEventListener("keyup", async (e) => {
          const input = e.target.value;

          let isNumber = /^\d+$/.test(input);

          if (isNumber) {
            const users = await services.filterUsers(input, "id");

            const options = users.map((user) => {
              return {
                label: user.username,
                value: user.id,
              };
            });

            this.setState({ usersOptions: options });
          } else {
            if (input.length >= 3) {
              const users = await services.filterUsers(input, "username");

              const options = users.map((user) => {
                return {
                  label: user.username,
                  value: user.id,
                };
              });

              this.setState({ usersOptions: options });
            }
          }
        });

      this.setState({
        usersOptions: usersOptions,
        zones: zones,
      });

      $(".oneSignal").on("click", () => {
        let active = sessionStorage.getItem("isMenuActive");

        if (active == "true") {
          services.handleMenuToggle();
        }
      });

      $(".loading").hide();
    }
  }

  async sendNotification(e) {
    let body;
    const { title, message, selectedZone, selectedUser } = this.state;
    const selection = $("input[name='recieversOption']:checked").val();
    let response;

    switch (selection) {
      case "all":
        body = {
          toAll: true,
          title: title,
          message: message,
        };

        response = await services.sendPushNotification(body);

        break;

      case "selection":
        body = {
          toAll: false,
          title: title,
          message: message,
          id: selectedUser,
        };

        response = await services.sendPushNotification(body);

        break;

      case "zone":
        body = {
          title: title,
          message: message,
          zone: selectedZone,
        };

        response = await services.sendPushToZone(body);

        break;

      default:
        break;
    }

    console.log(response);
  }

  render() {
    return (
      <main className="oneSignal">
        <Menu />

        <div className="loading">
          <Spinner className="spinner" animation="border" />
        </div>

        <div className="pageHeader">
          <div className="menuToggle" onClick={services.handleMenuToggle}>
            <span className="material-symbols-rounded">menu</span>
          </div>

          <div className="pageTitle">
            <h1>One Signal</h1>
            <span className="material-symbols-rounded">
              radio_button_checked
            </span>
          </div>
        </div>

        <div className="w-fit mx-auto mb-28 rounded shadow-lg p-5 mt-40 overflow-visible">
          <form
            className="mx-auto overflow-visible flex flex-col items-center"
            style={{ width: "50rem" }}
            onSubmit={(e) => {
              e.preventDefault();

              this.sendNotification();
            }}
          >
            <section className="p-2 w-full overflow-visible">
              <div className="flex items-center text-lg rounded shadow-md h-20 px-5 my-3 relative">
                <Form.Check
                  className="m-0 p-3"
                  type="radio"
                  name="recieversOption"
                  value="all"
                  onClick={() => {
                    $("#userSelect").addClass("hidden");
                    $("#zoneSelect").addClass("hidden");
                  }}
                  required
                />

                <p>
                  Enviar para <b className="text-rango-orange">Todos</b>
                </p>
              </div>

              <div className="flex items-center text-lg rounded shadow-md h-20 px-5 my-3 transition-all">
                <Form.Check
                  className="m-0 p-3"
                  type="radio"
                  name="recieversOption"
                  value="selection"
                  onClick={() => {
                    $("#userSelect").removeClass("hidden");
                    $("#zoneSelect").addClass("hidden");
                  }}
                  required
                />

                <p>
                  Enviar para <b className="text-rango-orange">Usuário</b>
                </p>
              </div>

              <div className="flex items-center text-lg rounded shadow-md h-20 px-5 my-3">
                <Form.Check
                  className="m-0 p-3"
                  type="radio"
                  name="recieversOption"
                  value="zone"
                  onClick={() => {
                    $("#userSelect").addClass("hidden");
                    $("#zoneSelect").removeClass("hidden");
                  }}
                  required
                />

                <p>
                  Enviar para <b className="text-rango-orange">Zona</b>
                </p>
              </div>
            </section>

            <Select
              placeholder="Selecionar usuário"
              id="userSelect"
              name="recievers"
              className="basic-single overflow-visible shadow-sm rounded hidden"
              classNamePrefix="select"
              options={this.state.usersOptions}
              isSearchable="true"
              onChange={(e) => {
                this.setState({
                  selectedUser: e.value,
                });
              }}
            ></Select>

            <Select
              placeholder="Selecionar zona"
              id="zoneSelect"
              name="recievers"
              className="basic-single overflow-visible shadow-sm rounded hidden"
              classNamePrefix="select"
              options={this.state.zones}
              isSearchable="true"
              onChange={(e) => {
                this.setState({
                  selectedZone: e.value,
                });
              }}
            ></Select>

            <section className="w-full overflow-visible">
              <div className="w-full p-2 mt-3 mb-6 overflow-visible">
                <label
                  htmlFor=""
                  className="w-full h-20 flex items-center justify-between overflow-visible ml-3 text-lg font-bold relative"
                >
                  <strong>Título:</strong>

                  <p
                    className="cursor-pointer m-auto shadow-md p-2 rounded absolute right-5"
                    onClick={() => {
                      this.setState({
                        showTitleEmoji: !this.state.showTitleEmoji,
                      });
                    }}
                  >
                    &#128515;
                  </p>

                  {this.state.showTitleEmoji ? (
                    <EmojiPicker
                      height={"400px"}
                      onEmojiClick={(e) => {
                        $("#title").val($("#title").val() + e.emoji);
                      }}
                    />
                  ) : null}
                </label>

                <input
                  id="title"
                  type="text"
                  placeholder="Título incrível aqui"
                  className="rounded shadow-md w-full h-16 px-3 focus:outline-rango-orange"
                  onChange={(e) => {
                    this.setState({
                      title: e.target.value,
                    });
                  }}
                  required
                />
              </div>

              <div className="w-full p-2 mt-3 mb-6 overflow-visible">
                <label
                  htmlFor=""
                  className="w-full h-20 flex items-center justify-between overflow-visible ml-3 text-lg font-bold relative"
                >
                  <strong>Mensagem:</strong>

                  <p
                    className="cursor-pointer m-auto shadow-md p-2 rounded absolute right-5"
                    onClick={() => {
                      this.setState({
                        showMessageEmoji: !this.state.showMessageEmoji,
                      });
                    }}
                  >
                    &#128515;
                  </p>

                  {this.state.showMessageEmoji ? (
                    <EmojiPicker
                      height={"400px"}
                      onEmojiClick={(e) => {
                        $("#message").val($("#message").val() + e.emoji);
                      }}
                    />
                  ) : null}
                </label>

                <input
                  id="message"
                  type="text"
                  placeholder="Mensagem incrível aqui"
                  className="rounded shadow-md w-full h-16 px-3 focus:outline-rango-orange"
                  onChange={(e) => {
                    this.setState({
                      message: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </section>

            <button
              style={{ width: "calc(100% - .5rem)" }}
              className="rounded shadow-md h-16 text-rango-orange text-lg transition-all hover:bg-orange-100 hover:shadow-md mt-3"
            >
              Enviar
            </button>
          </form>
        </div>
      </main>
    );
  }
}
