import React, { useEffect, useState } from "react";
import { Button, FloatingLabel, Form, Spinner } from "react-bootstrap";
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

      window.location = "/#/powerBi";
    }
    $(".loading").hide();
  }

  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center">
      <Form
        style={{
          width: "50rem",
        }}
        onSubmit={handleLogin}
        className="rounded shadow-lg m-auto flex flex-col items-center p-5"
      >
        <img src={logo} alt="Logo" className="w-52 mt-5" />

        <hr className="w-3/5 border-b-2 border-grey-400 my-10" />

        <FloatingLabel
          label="Usuário"
          className="w-1/2 h-20 p-1 focus:shadow-black"
        >
          <Form.Control
            className="shadow-md border-none"
            type="text"
            placeholder="Login"
            onChange={(e) => {
              setIdentifier(e.target.value);
            }}
            required
          />
        </FloatingLabel>

        <FloatingLabel
          label="Senha"
          className="w-1/2 h-20 p-1 focus:shadow-black"
        >
          <Form.Control
            className="shadow-md border-none"
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </FloatingLabel>

        <a className="text-lg text-rango-orange my-4 hover:text-rango-orange" href="/#/register">
          Criar Conta
        </a>

        <Button
          type="submit"
          className="w-1/2 h-14 mb-5 text-white bg-rango-orange border-none shadow-md hover:bg-rango-orange hover:shadow-lg"
        >
          Entrar
        </Button>
      </Form>

      <div className="loading">
        <Spinner className="spinner" animation="border" />
      </div>
    </main>
  );
}
