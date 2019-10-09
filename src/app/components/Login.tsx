import { observer } from "mobx-react-lite"
import React from "react"
import useInput from "../../dom/hooks/useInput"
import Button from "../../ui/components/Button"
import FormField from "../../ui/components/FormField"
import FullscreenRaisedPanel from "../../ui/components/FullscreenRaisedPanel"
import RaisedPanelHeader from "../../ui/components/RaisedPanelHeader"
import TextInput from "../../ui/components/TextInput"
import { spacedChildrenVertical } from "../../ui/helpers"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import useRootStore from "../../useRootStore"

function Login() {
  const {
    userStore: { loginState, submitLogin },
  } = useRootStore()

  const isLoading = loginState.type === "loading"
  const error = loginState.type === "error" ? loginState.error : undefined

  const account = useInput()
  const password = useInput()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    submitLogin(account.value, password.value)
  }

  return (
    <FullscreenRaisedPanel>
      <RaisedPanelHeader center={<h1>Login</h1>} />
      <Form onSubmit={handleSubmit}>
        <FieldSet disabled={isLoading}>
          <FormField labelText="Username">
            <TextInput
              name="username"
              placeholder="awesomeuser"
              required
              {...account.bind}
            />
          </FormField>

          <FormField labelText="Password">
            <TextInput
              name="password"
              type="password"
              placeholder="••••••••"
              required
              {...password.bind}
            />
          </FormField>

          <Button type="submit">Submit</Button>
        </FieldSet>

        {error ? <ErrorText>{error}</ErrorText> : null}
      </Form>
    </FullscreenRaisedPanel>
  )
}

export default observer(Login)

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${spacing.small};
  ${spacedChildrenVertical()};
`

const ErrorText = styled.p`
  max-width: 100%;
`

const FieldSet = styled.fieldset`
  width: 100%;
  transition: 0.2s opacity;

  :disabled {
    opacity: 0.5;
  }

  ${spacedChildrenVertical()};
`
