import { navigate, RouteComponentProps } from "@reach/router"
import { Formik, FormikProps } from "formik"
import React, { useContext } from "react"
import { authenticate } from "../flist/api"
import SessionContainer from "../session/SessionContainer"
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

type Props = RouteComponentProps

function LoginScreen(props: Props) {
  const session = useContext(SessionContainer.Context)

  function renderForm(formikProps: FormikProps<LoginValues>) {
    return (
      <Overlay>
        <ContentContainer>
          <HeaderText>next</HeaderText>
          <Form onSubmit={formikProps.handleSubmit}>
            <FormField labelText="Username">
              <TextInput
                name="account"
                placeholder="awesomeuser"
                value={formikProps.values.account}
                onChange={formikProps.handleChange}
              />
            </FormField>
            <FormField labelText="Password">
              <TextInput
                name="password"
                type="password"
                placeholder="••••••••"
                value={formikProps.values.password}
                onChange={formikProps.handleChange}
              />
            </FormField>
            <Button type="submit">Submit</Button>
          </Form>
        </ContentContainer>
      </Overlay>
    )
  }

  async function handleSubmit({ account, password }: LoginValues) {
    const { ticket, characters } = await authenticate(account, password)
    session.setData({ account, ticket, characters })
    navigate("character-select")
  }

  return (
    <Formik<LoginValues>
      initialValues={initialValues}
      render={renderForm}
      onSubmit={handleSubmit}
    />
  )
}
export default LoginScreen

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
