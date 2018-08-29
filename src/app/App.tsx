import { Formik, FormikProps } from "formik"
import React from "react"
import { ClientCommands } from "../network/types"
import { Button } from "../ui/Button"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Modal } from "../ui/Modal"
import { styled } from "../ui/styled"
import { TextInput } from "../ui/TextInput"

const initialValues = {
  account: "",
  password: "",
}

type LoginValues = typeof initialValues

export class App extends React.Component {
  socket?: WebSocket

  sendCommand = <K extends keyof ClientCommands>(cmd: K, params: ClientCommands[K]) => {
    if (this.socket) {
      this.socket.send(`${cmd} ${JSON.stringify(params)}`)
    }
  }

  connect = (account: string, ticket: string, character: string) => {
    const socket = (this.socket = new WebSocket(`wss://chat.f-list.net:9799`))

    socket.onopen = () => {
      this.sendCommand("IDN", {
        account,
        ticket,
        character,
        cname: "string",
        cversion: "string",
        method: "ticket",
      })
    }

    socket.onclose = () => {
      this.socket = undefined
    }

    socket.onmessage = () => {}
  }

  handleSubmit = (values: LoginValues) => {
    console.log(values)
  }

  renderForm = (props: FormikProps<LoginValues>) => {
    return (
      <Modal>
        <HeaderText>next</HeaderText>
        <Form onSubmit={props.handleSubmit}>
          <FormField>
            <TextInput
              labelText="Username"
              name="account"
              placeholder="Username"
              value={props.values.account}
              onChange={props.handleChange}
            />
          </FormField>
          <FormField>
            <TextInput
              labelText="Password"
              name="password"
              type="password"
              placeholder="Password"
              value={props.values.password}
              onChange={props.handleChange}
            />
          </FormField>
          <Button type="submit">Submit</Button>
        </Form>
      </Modal>
    )
  }

  render() {
    return (
      <Formik<LoginValues>
        initialValues={initialValues}
        render={this.renderForm}
        onSubmit={this.handleSubmit}
      />
    )
  }
}

const HeaderText = styled.h1`
  margin: 1rem 0rem;
  text-align: center;
`
