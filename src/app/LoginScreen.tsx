import { Formik, FormikProps } from "formik"
import React from "react"
import { Button } from "../ui/Button"
import { flist3 } from "../ui/colors"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Overlay } from "../ui/Overlay"
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

export class LoginScreen extends React.Component<Props> {
  render() {
    return (
      <Formik<LoginValues>
        initialValues={initialValues}
        render={this.renderForm}
        onSubmit={this.handleSubmit}
      />
    )
  }

  private renderForm = (props: FormikProps<LoginValues>) => {
    return (
      <Overlay>
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
      </Overlay>
    )
  }

  private handleSubmit = async (values: LoginValues) => {
    this.props.onSubmit(values)
  }
}

const ContentContainer = styled.div`
  background-color: ${flist3};
  width: 18rem;
  max-width: 100%;
  padding: 1rem;
`

const HeaderText = styled.h1`
  margin-bottom: 1rem;
  text-align: center;
`
