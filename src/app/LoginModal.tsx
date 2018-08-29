import { Formik, FormikProps } from "formik"
import React from "react"
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

export type LoginValues = typeof initialValues

type Props = {
  onSubmit: (values: LoginValues) => void
}

export class LoginModal extends React.Component<Props> {
  handleSubmit = (values: LoginValues) => {
    this.props.onSubmit(values)
  }

  renderForm = (props: FormikProps<LoginValues>) => {
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

const ContentContainer = styled.div`
  padding: 1rem;
`

const HeaderText = styled.h1`
  margin-bottom: 1rem;
  text-align: center;
`
