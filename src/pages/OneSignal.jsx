import React, { Component } from "react";
import { Form, Spinner } from "react-bootstrap";
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
      selectedUser: "",
      usersOptions: [],
      showTitleEmoji: false,
      showMessageEmoji: false,
    };

    this.sendNotification = this.sendNotification.bind(this);
  }

  async componentDidMount() {
    sessionStorage.setItem("isMenuActive", false);
    const token = sessionStorage.getItem("token");
    $(".loading").show();

    if (!token) {
      $(".loading").hide();
      $(".coupons").html("Not Authorized!!");
    } else {
      const users = await services.getUsers(0);
      $("#oneSignalSelect").hide();

      const usersOptions = users.users.map((user) => {
        return {
          label: user.username,
          value: user.id,
        };
      });

      document
        .getElementById("oneSignalSelect")
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
    e.preventDefault();

    $(".loading").show();

    const message = $("#message")[0].value;

    const title = $("#title")[0].value;
    const user = this.state.selectedUser;

    let body = { title: title, message: message };

    const selectedRadio = document.querySelector(
      'input[name="oneSignalRadio"]:checked'
    ).value;

    if (selectedRadio == "one") {
      body = {
        ...body,
        toAll: false,
        id: user,
      };
    } else {
      body = {
        ...body,
        toAll: true,
      };
    }

    await services.sendPushNotification(body);

    $(".loading").hide();
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

        <h1>Envie notificações para UM ou TODOS os usuários</h1>

        <div className="oneSignalContainer">
          <Form
            id="oneSignalForm"
            onSubmit={(e) => {
              this.sendNotification(e);
            }}
          >
            <Form.Group id="checkboxContainer">
              <Form.Check
                id="one"
                name="oneSignalRadio"
                type="radio"
                label="UM usuário"
                value="one"
                onClick={() => {
                  $("#oneSignalSelect").show();
                }}
                required
              />

              <Form.Check
                id="all"
                name="oneSignalRadio"
                type="radio"
                label="TODOS os usuários"
                value="all"
                onClick={() => {
                  $("#oneSignalSelect").hide();
                }}
                required
              />
            </Form.Group>

            <Select
              className="basic-single"
              id="oneSignalSelect"
              classNamePrefix="select"
              options={this.state.usersOptions}
              isSearchable="true"
              onChange={(e) => {
                this.setState({ selectedUser: e.value });
              }}
            ></Select>

            <Form.Group style={{ overflow: "visible" }}>
              <Form.Label>
                <strong>Título:</strong>

                {this.state.showTitleEmoji ? (
                  <EmojiPicker
                    height="20rem"
                    className="emojiPicker"
                    onEmojiClick={(emoji) => {
                      $("#title").val(`${$("#title")[0].value}${emoji.emoji}`);
                    }}
                  />
                ) : null}

                <p
                  onClick={() => {
                    this.setState({
                      showTitleEmoji: !this.state.showTitleEmoji,
                    });
                  }}
                >
                  &#128512;
                </p>
              </Form.Label>
              <Form.Control
                id="title"
                name="title"
                type="text"
                placeholder="Título incrível aqui"
                required
              />
              <Form.Label style={{ overflow: "visible" }}>
                <strong>Mensagem:</strong>

                {this.state.showMessageEmoji ? (
                  <EmojiPicker
                    height="20rem"
                    className="emojiPicker"
                    onEmojiClick={(emoji) => {
                      $("#message").val(
                        `${$("#message")[0].value}${emoji.emoji}`
                      );
                    }}
                  />
                ) : null}

                <p
                  onClick={() => {
                    this.setState({
                      showMessageEmoji: !this.state.showMessageEmoji,
                    });
                  }}
                >
                  &#128512;
                </p>
              </Form.Label>
              <Form.Control
                id="message"
                name="message"
                type="text"
                placeholder="Mensagem incrível aqui"
                required
              />
            </Form.Group>

            <button type="submit">Enviar</button>
          </Form>
        </div>
      </main>
    );
  }
}
