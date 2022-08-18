import React from "react";
import { Button, Form } from "react-bootstrap";

import logo from "../assets/logo.svg";
import "./Register.scss";

export default function Register() {
  async function handleRegister(e) {
    e.preventDefault();

    console.log("register");
  }

  return (
    <main className="register">
      <img src={logo} alt="Logo" />

      <a href="/">Fazer login</a>

      <Form onSubmit={handleRegister}>
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" placeholder="hugomonstro" />

          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="parana@parana.com" />

          <Form.Label>CPF</Form.Label>
          <Form.Control type="text" placeholder="000.000.000-00" />

          <Form.Label>Telefone</Form.Label>
          <Form.Control type="text" placeholder="(00) 00000-0000" />

          <Form.Label>Senha</Form.Label>
          <Form.Control type="Password" placeholder="123456" />
        </Form.Group>

        <Button type="submit">Enviar</Button>
      </Form>
    </main>
  );
}
