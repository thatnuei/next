import { navigate, RouteComponentProps } from "@reach/router"
import React, { useContext } from "react"
import useInput from "../state/useInput"
import { Button } from "../ui/Button"
import { flist3 } from "../ui/colors"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Overlay } from "../ui/Overlay"
import { styled } from "../ui/styled"
import { TextInput } from "../ui/TextInput"
import AppStateContainer from "./AppStateContainer"
import routePaths from "./routePaths"

type Props = RouteComponentProps

function LoginRoute(props: Props) {
  const appState = useContext(AppStateContainer.Context)
  const account = useInput()
  const password = useInput()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    try {
      await appState.submitLogin(account.value, password.value)
      navigate(routePaths.characterSelect)
    } catch (error) {
      alert(error)
    }
  }

  return (
    <Overlay>
      <ContentContainer>
        <HeaderText>next</HeaderText>
        <Form onSubmit={handleSubmit}>
          <FormField labelText="Username">
            <TextInput placeholder="awesomeuser" {...account.bind} />
          </FormField>
          <FormField labelText="Password">
            <TextInput type="password" placeholder="••••••••" {...password.bind} />
          </FormField>
          <Button type="submit">Submit</Button>
        </Form>
      </ContentContainer>
    </Overlay>
  )
}
export default LoginRoute

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
