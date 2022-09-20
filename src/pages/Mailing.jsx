import React, { Component } from "react";
import { Form } from "react-bootstrap";
import Menu from "../components/Menu";
import { Services } from "../services";
import Select from "react-select";

import $ from "jquery";

import "./Mailing.scss";
import BundledEditor from "../components/Editor";
import tinymce from "tinymce";
import axios from "axios";

const services = new Services();

export default class Mailing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usersOptions: [],
    };

    this.handleMailing = this.handleMailing.bind(this);
  }

  async componentDidMount() {
    sessionStorage.setItem("isMenuActive", false);
    const token = sessionStorage.getItem("token");
    $(".loading").show();

    if (!token) {
      $(".loading").hide();
      $(".powerBi").html("Not Authorized!!");
    } else {
      const users = await services.getUsers(0);

      const usersOptions = users.users.map((user) => {
        return {
          label: user.username,
          value: user.email,
        };
      });

      $("#mailingUserSelect").hide();

      document
        .querySelector(".userSearch")
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
                  value: user.email,
                };
              });

              this.setState({ usersOptions: options });
            }
          }
        });

      $(".mailing").on("click", () => {
        let active = sessionStorage.getItem("isMenuActive");

        if (active == "true") {
          services.handleMenuToggle();
        }
      });

      this.setState({ usersOptions: usersOptions });

      $(".loading").hide();
    }
  }

  async handleMailing(e) {
    e.preventDefault();

    $(".loading").show();

    const form = $("#mailingForm").serializeArray();
    var subject, title, body, sender;
    var recievers = new Array();
    var allRecievers = new Array();
    var body = $("textarea").val();
    let toAllUsers = false;

    const allUsers = await services.getAllUsers();

    allUsers.map((el) => {
      allRecievers.push(el.email);
    });

    form.map((e) => {
      if (e.value.trim() != "") {
        e.name == "subject"
          ? (subject = e.value)
          : e.name == "title"
          ? (title = e.value)
          : e.name == "users"
          ? recievers.push(e.value)
          : e.name == "sender"
          ? (sender = e.value)
          : null;
      }
    });

    let requestBody;

    if (toAllUsers) {
      requestBody = {
        subject: subject,
        title: title,
        body: body,
        sender: sender != "" ? sender : null,
        recievers: allRecievers,
      };
    } else {
      requestBody = {
        subject: subject,
        title: title,
        body: body,
        sender: sender != "" ? sender : null,
        recievers: recievers,
      };
    }

    const response = await services.sendMail(requestBody);
    console.log(response);

    $(".loading").hide();

    window.location.reload();
  }

  render() {
    return (
      <main className="mailing">
        <Menu />

        <div className="pageHeader">
          <div className="menuToggle" onClick={services.handleMenuToggle}>
            <span className="material-symbols-rounded">menu</span>
          </div>

          <div className="pageTitle">
            <h1>Mailing</h1>
            <span className="material-symbols-rounded">send</span>
          </div>
        </div>

        <section className="pageContainer mailingContainer">
          <h1>
            Envio de e-mails comerciais utilizando o <span>RanGo Mailer</span>
          </h1>

          <Form
            id="mailingForm"
            onSubmit={(e) => {
              this.handleMailing(e);
            }}
          >
            <Form.Group className="mailingFormGroup">
              <Form.Label>Assunto:</Form.Label>

              <Form.Control name="subject" type="text" />

              <Form.Label>Título:</Form.Label>

              <Form.Control name="title" type="text" />

              <Form.Label>Remetente: (opcional)</Form.Label>

              <Form.Control name="sender" type="text" />

              <p style={{ fontSize: "1rem", color: "#717171" }}>
                * Ao omitir remetente: comercial@rangosemfila.com.br
              </p>
            </Form.Group>

            <div id="editor">
              <Form.Label>Corpo:</Form.Label>

              <BundledEditor
                id="editor"
                initialValue="<p></p>"
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "anchor",
                    "autolink",
                    "charmap",
                    "emoticons",
                    "help",
                    "image",
                    "link",
                    "lists",
                    "media",
                    "nonbreaking",
                    "preview",
                    "searchreplace",
                    "table",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | charmap emoticons media | nonbreaking " +
                    "bold italic link | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent  | " +
                    "preview removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>

            <Form.Group id="radioInputs">
              <Form.Label>Enviar para:</Form.Label>

              <div id="radioOptions">
                <Form.Check
                  name="recievers"
                  type="radio"
                  label="Todos"
                  onClick={() => {
                    $("#mailingUserSelect").hide();
                  }}
                  required
                />

                <Form.Check
                  name="recievers"
                  type="radio"
                  label="Selecionar"
                  onClick={() => {
                    $("#mailingUserSelect").show();
                  }}
                  required
                />
              </div>

              <Select
                id="mailingUserSelect"
                name="users"
                className="basic-single customSelect userSearch"
                classNamePrefix="select"
                options={this.state.usersOptions}
                isSearchable="true"
                isMulti
              ></Select>
            </Form.Group>

            <button id="mailingFormButton" type="submit">
              Enviar
            </button>
          </Form>
        </section>
      </main>
    );
  }
}
