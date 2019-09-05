import React from "react"
import useInput from "../../dom/hooks/useInput"
import { useStore } from "../../store"
import Button from "../../ui/components/Button"
import FormField from "../../ui/components/FormField"
import FullscreenRaisedPanel from "../../ui/components/FullscreenRaisedPanel"
import ModalPanelHeader from "../../ui/components/ModalPanelHeader"
import TextInput from "../../ui/components/TextInput"
import { spacedChildrenVertical } from "../../ui/helpers"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"

function Login() {
  const store = useStore()
  const { loading, error } = store.state.login
  const { submitLogin } = store.actions

  const account = useInput()
  const password = useInput()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    submitLogin({
      account: account.value,
      password: password.value,
    })
  }

  return (
    <FullscreenRaisedPanel>
      <ModalPanelHeader>Login</ModalPanelHeader>
      <Form onSubmit={handleSubmit}>
        <FieldSet disabled={loading}>
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

export default Login

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
