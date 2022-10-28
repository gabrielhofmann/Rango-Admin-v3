import React, { Component } from "react";
import { FloatingLabel, Form, Spinner } from "react-bootstrap";
import Menu from "../components/Menu";
import { Services } from "../services";
import Select from "react-select";

import $ from "jquery";

import "./Mailing.scss";
import axios from "axios";

const services = new Services();

export default class Mailing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usersOptions: [],
      editorContent: "",
      selectedUsers: [],
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

      CKEDITOR.ClassicEditor.create(document.getElementById("editor"), {
        // https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html#extended-toolbar-configuration-format
        toolbar: {
          items: [
            "exportPDF",
            "exportWord",
            "|",
            "findAndReplace",
            "selectAll",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "strikethrough",
            "underline",
            "code",
            "subscript",
            "superscript",
            "removeFormat",
            "|",
            "bulletedList",
            "numberedList",
            "todoList",
            "|",
            "outdent",
            "indent",
            "|",
            "undo",
            "redo",
            "-",
            "fontSize",
            "fontFamily",
            "fontColor",
            "fontBackgroundColor",
            "highlight",
            "|",
            "alignment",
            "|",
            "link",
            "insertImage",
            "blockQuote",
            "insertTable",
            "mediaEmbed",
            "codeBlock",
            "htmlEmbed",
            "|",
            "specialCharacters",
            "horizontalLine",
            "pageBreak",
            "|",
            "textPartLanguage",
            "|",
            "sourceEditing",
          ],
          shouldNotGroupWhenFull: true,
        },
        // Changing the language of the interface requires loading the language file using the <script> tag.
        // language: 'es',
        list: {
          properties: {
            styles: true,
            startIndex: true,
            reversed: true,
          },
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/headings.html#configuration
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4",
            },
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
              class: "ck-heading_heading5",
            },
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
              class: "ck-heading_heading6",
            },
          ],
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/editor-placeholder.html#using-the-editor-configuration
        placeholder: "Welcome to CKEditor 5!",
        // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-family-feature
        fontFamily: {
          options: [
            "default",
            "Arial, Helvetica, sans-serif",
            "Courier New, Courier, monospace",
            "Georgia, serif",
            "Lucida Sans Unicode, Lucida Grande, sans-serif",
            "Tahoma, Geneva, sans-serif",
            "Times New Roman, Times, serif",
            "Trebuchet MS, Helvetica, sans-serif",
            "Verdana, Geneva, sans-serif",
          ],
          supportAllValues: true,
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-size-feature
        fontSize: {
          options: [10, 12, 14, "default", 18, 20, 22],
          supportAllValues: true,
        },
        // Be careful with the setting below. It instructs CKEditor to accept ALL HTML markup.
        // https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html#enabling-all-html-features
        htmlSupport: {
          allow: [
            {
              name: /.*/,
              attributes: true,
              classes: true,
              styles: true,
            },
          ],
        },
        // Be careful with enabling previews
        // https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
        htmlEmbed: {
          showPreviews: true,
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/link.html#custom-link-attributes-decorators
        link: {
          decorators: {
            addTargetToExternalLinks: true,
            defaultProtocol: "https://",
            toggleDownloadable: {
              mode: "manual",
              label: "Downloadable",
              attributes: {
                download: "file",
              },
            },
          },
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#configuration
        mention: {
          feeds: [
            {
              marker: "@",
              feed: [
                "@apple",
                "@bears",
                "@brownie",
                "@cake",
                "@cake",
                "@candy",
                "@canes",
                "@chocolate",
                "@cookie",
                "@cotton",
                "@cream",
                "@cupcake",
                "@danish",
                "@donut",
                "@dragée",
                "@fruitcake",
                "@gingerbread",
                "@gummi",
                "@ice",
                "@jelly-o",
                "@liquorice",
                "@macaroon",
                "@marzipan",
                "@oat",
                "@pie",
                "@plum",
                "@pudding",
                "@sesame",
                "@snaps",
                "@soufflé",
                "@sugar",
                "@sweet",
                "@topping",
                "@wafer",
              ],
              minimumCharacters: 1,
            },
          ],
        },
        // The "super-build" contains more premium features that require additional configuration, disable them below.
        // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
        removePlugins: [
          // These two are commercial, but you can try them out without registering to a trial.
          // 'ExportPdf',
          // 'ExportWord',
          "CKBox",
          "CKFinder",
          "EasyImage",
          // This sample uses the Base64UploadAdapter to handle image uploads as it requires no configuration.
          // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/base64-upload-adapter.html
          // Storing images as Base64 is usually a very bad idea.
          // Replace it on production website with other solutions:
          // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/image-upload.html
          // 'Base64UploadAdapter',
          "RealTimeCollaborativeComments",
          "RealTimeCollaborativeTrackChanges",
          "RealTimeCollaborativeRevisionHistory",
          "PresenceList",
          "Comments",
          "TrackChanges",
          "TrackChangesData",
          "RevisionHistory",
          "Pagination",
          "WProofreader",
          // Careful, with the Mathtype plugin CKEditor will not load when loading this sample
          // from a local file system (file://) - load this site via HTTP server if you enable MathType
          "MathType",
        ],
      })
        .then((editor) => {
          editor.model.document.on("change:data", () => {
            this.setState({ editorContent: editor.getData() });
          });
        })
        .catch((error) => {
          console.error(error);
        });

      this.setState({ usersOptions: usersOptions });

      $(".loading").hide();
    }
  }

  async handleMailing(e) {
    e.preventDefault();

    $(".loading").show();

    let toAllUsers = false;

    const body = this.state.editorContent;
    const sender = $("#sender")[0].value;
    const title = $("#title")[0].value;
    const subject = $("#subject")[0].value;
    const recievers = this.state.selectedUsers;

    const radio = $("input[name='recievers']:checked")[0].value;

    radio == "all" ? (toAllUsers = true) : (toAllUsers = false);

    let requestBody = {
      subject: subject,
      title: title,
      recievers: recievers,
      sender: sender,
      body: body,
    };

    console.log(requestBody);

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
                <FloatingLabel label="Assunto" className="customLabel">
                  <Form.Control
                    id="subject"
                    placeholder="assunto"
                    name="subject"
                    type="text"
                    required
                  />
                </FloatingLabel>

                <FloatingLabel label="Título" className="customLabel">
                  <Form.Control
                    id="title"
                    placeholder="titulo"
                    name="title"
                    type="text"
                    required
                  />
                </FloatingLabel>

                <FloatingLabel label="Remetente" className="customLabel">
                  <Form.Control
                    id="sender"
                    placeholder="remetente"
                    name="sender"
                    type="text"
                    required
                  />
                </FloatingLabel>
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
                  onChange={(e) => {
                    let users = e.map((user) => {
                      return user.value;
                    });

                    this.setState({
                      selectedUsers: users,
                    });
                  }}
                ></Select>
              </Form.Group>
            </div>

            <div id="editor"></div>

            <button id="mailingFormButton" type="submit">
              Enviar
            </button>
          </Form>
        </section>
      </main>
    );
  }
}
