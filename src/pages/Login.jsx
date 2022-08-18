import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { Services } from "../services";
import $ from "jquery";

import logo from "../assets/logo.svg";
import "./Login.scss";

const services = new Services();

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    $(".loading").show();

    const login = await services.login(identifier, password);

    console.log(login);

    if (login.message == "200") {
      sessionStorage.setItem("token", login.jwt);

      $(".loginInput").each(function (index, element) {
        $(element).css("border", "3px solid green");
      });

      window.location = "/#/powerBi";
    } else {
      $(".loginInput").each(function (index, element) {
        $(element).css("border", "3px solid red");
      });
    }

    $(".loading").hide();
  }

  return (
    <main className="login">
      <img src={logo} alt="Logo" />

      <Form onSubmit={handleLogin} className="loginForm">
        <Form.Group>
          <Form.Label htmlFor="loginEmail">Email</Form.Label>
          <Form.Control
            className="loginInput"
            type="email"
            placeholder="parana@parana.com"
            name="loginEmail"
            onChange={(e) => {
              setIdentifier(e.target.value);
            }}
          />

          <Form.Label htmlFor="loginPassword">Senha</Form.Label>
          <Form.Control
            className="loginInput"
            type="password"
            placeholder="parana"
            name="loginPassword"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <Button type="submit">Entrar</Button>
        </Form.Group>
      </Form>

      <a href="/#/register">Criar conta</a>

      <div className="loading">
        <Spinner className="spinner" animation="border" />
      </div>
    </main>
  );
}
