import { Formik, FormikProps } from "formik"
import React from "react"
import { Button } from "../ui/Button"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Modal } from "../ui/Modal"
import { styled } from "../ui/styled"
import { TextInput } from "../ui/TextInput"
import { appStore } from "./AppStore"
import { sessionStore } from "./SessionStore"

const initialValues = {
  account: "",
  password: "",
}

export type LoginValues = typeof initialValues

export class LoginModal extends React.Component {
  render() {
    return (
      <Formik<LoginValues>
        initialValues={initialValues}
        render={this.renderForm}
        onSubmit={this.handleSubmit}
      />
    )
  }

  private handleSubmit = async (values: LoginValues) => {
    try {
      await sessionStore.submitLogin(values.account, values.password)
      sessionStore.saveSession()
      appStore.setScreen("selectCharacter")
    } catch (error) {
      console.error(error)
      alert(error.message || String(error)) // TODO: replace with actual error modal
    }
  }

  private renderForm = (props: FormikProps<LoginValues>) => {
    return (
      <Modal panelWidth="18rem">
        <ContentContainer>
          <HeaderText>next</HeaderText>
          <Form onSubmit={props.handleSubmit}>
            <FormField labelText="Username">
              <TextInput
                name="account"
                placeholder="awesomeuser"
                value={props.values.account}
                onChange={props.handleChange}
              />
            </FormField>
            <FormField labelText="Password">
              <TextInput
                name="password"
                type="password"
                placeholder="••••••••"
                value={props.values.password}
                onChange={props.handleChange}
              />
            </FormField>
            <Button type="submit">Submit</Button>
          </Form>
        </ContentContainer>
      </Modal>
    )
  }
}

const ContentContainer = styled.div`
  padding: 1rem;
`

const HeaderText = styled.h1`
  margin-bottom: 1rem;
  text-align: center;
`
