import React, { Component } from "react";
import { Form, Spinner } from "react-bootstrap";
import Menu from "../components/Menu";
import { Services } from "../services";
import Select from "react-select";

import $ from "jquery";

import "./Mailing.scss";
import axios from "axios";

import { Editor } from "@tinymce/tinymce-react";

// TinyMCE so the global var exists
// eslint-disable-next-line no-unused-vars
import tinymce from "tinymce/tinymce";
// DOM model
import "../../public/tinymce/models/dom/model.min.js";
// Theme
import "../../public/tinymce/themes/silver/theme.min.js";
// Toolbar icons
import "../../public/tinymce/icons/default/icons.min.js";
// Editor styles
import "../../public/tinymce/skins/ui/oxide/skin.min.css";

// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to load
import "../../public/tinymce/plugins/advlist/plugin.min.js";
import "../../public/tinymce/plugins/anchor/plugin.min.js";
import "../../public/tinymce/plugins/autolink/plugin.min.js";
import "../../public/tinymce/plugins/autoresize/plugin.min.js";
import "../../public/tinymce/plugins/autosave/plugin.min.js";
import "../../public/tinymce/plugins/charmap/plugin.min.js";
import "../../public/tinymce/plugins/code/plugin.min.js";
import "../../public/tinymce/plugins/codesample/plugin.min.js";
import "../../public/tinymce/plugins/directionality/plugin.min.js";
import "../../public/tinymce/plugins/emoticons/plugin.min.js";
import "../../public/tinymce/plugins/fullscreen/plugin.min.js";
import "../../public/tinymce/plugins/help/plugin.min.js";
import "../../public/tinymce/plugins/image/plugin.min.js";
import "../../public/tinymce/plugins/importcss/plugin.min.js";
import "../../public/tinymce/plugins/insertdatetime/plugin.min.js";
import "../../public/tinymce/plugins/link/plugin.min.js";
import "../../public/tinymce/plugins/lists/plugin.min.js";
import "../../public/tinymce/plugins/media/plugin.min.js";
import "../../public/tinymce/plugins/nonbreaking/plugin.min.js";
import "../../public/tinymce/plugins/pagebreak/plugin.min.js";
import "../../public/tinymce/plugins/preview/plugin.min.js";
import "../../public/tinymce/plugins/quickbars/plugin.min.js";
import "../../public/tinymce/plugins/save/plugin.min.js";
import "../../public/tinymce/plugins/searchreplace/plugin.min.js";
import "../../public/tinymce/plugins/table/plugin.min.js";
import "../../public/tinymce/plugins/template/plugin.min.js";
import "../../public/tinymce/plugins/visualblocks/plugin.min.js";
import "../../public/tinymce/plugins/visualchars/plugin.min.js";
import "../../public/tinymce/plugins/wordcount/plugin.min.js";

// importing plugin resources
import "tinymce/plugins/emoticons/js/emojis";

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
      $(".mailing").html("Not Authorized!!");
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
    var selectedRecievers = new Array();
    let toAllUsers = false;
    var body = tinyMCE.get("#tiny").getContent();

    const radio = $("input[name='recievers']:checked")[0].value;

    radio == "all" ? (toAllUsers = true) : (toAllUsers = false);

    form.map((e) => {
      if (e.value.trim() != "") {
        e.name == "subject"
          ? (subject = e.value)
          : e.name == "title"
          ? (title = e.value)
          : e.name == "users"
          ? selectedRecievers.push(e.value)
          : e.name == "sender"
          ? (sender = e.value)
          : e.name == "all"
          ? (toAllUsers = true)
          : null;
      }
    });

    let requestBody;

    if (toAllUsers) {
      let allUsers = await services.getAllUsers();

      allUsers = allUsers.map((user) => {
        if (user.email) {
          return user.email;
        }
      });

      requestBody = {
        subject: subject,
        title: title,
        body: body,
        sender: sender,
        recievers: allUsers,
      };
    } else {
      requestBody = {
        subject: subject,
        title: title,
        body: body,
        sender: sender,
        recievers: selectedRecievers,
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

        <div className="loading">
          <Spinner className="spinner" animation="border" />
        </div>

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
            <div className="formRow">
              <Form.Group className="mailingFormGroup">
                <Form.Label>Assunto:</Form.Label>

                <Form.Control name="subject" type="text" required />

                <Form.Label>Título:</Form.Label>

                <Form.Control name="title" type="text" required />

                <Form.Label>Remetente:</Form.Label>

                <Form.Control name="sender" type="text" required />
              </Form.Group>

              <Form.Group id="radioInputs" className="mailingFormGroup">
                <Form.Label>Enviar para:</Form.Label>

                <div id="radioOptions">
                  <Form.Check
                    name="recievers"
                    type="radio"
                    label="Todos"
                    value="all"
                    onClick={() => {
                      $("#mailingUserSelect").hide();
                    }}
                    required
                  />

                  <Form.Check
                    name="recievers"
                    type="radio"
                    label="Selecionar"
                    value="selected"
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
            </div>

            <Editor
              id="#tiny"
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "print",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "paste",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | " +
                  "bold italic charmap | alignleft aligncenter " +
                  "alignright alignjustify | outdent indent | " +
                  "| link image media charmap |" +
                  "| removeformat | help preview ",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />

            <button id="mailingFormButton" type="submit">
              Enviar
            </button>
          </Form>
        </section>
      </main>
    );
  }
}
