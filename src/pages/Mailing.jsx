import React, { Component } from "react";
import { Form } from "react-bootstrap";
import Menu from "../components/Menu";
import { Services } from "../services";

import $ from "jquery";

import "./Mailing.scss";
import BundledEditor from "../components/Editor";

const services = new Services();

export default class Mailing extends Component {
  constructor(props) {
    super(props);

    this.state = {};

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
      $(".mailing").on("click", () => {
        let active = sessionStorage.getItem("isMenuActive");

        if (active == "true") {
          services.handleMenuToggle();
        }
      });

      // EDITOR CONFIG

      $(".loading").hide();
    }
  }

  async handleMailing() {}

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

          <Form onSubmit={this.handleMailing}>
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
                <Form.Check name="recievers" type="radio" label="Todos" />

                <Form.Check name="recievers" type="radio" label="Selecionar" />
              </div>
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
