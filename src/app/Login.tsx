import React from "react"
import useInput from "../state/useInput"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { submitLogin } from "../store/login/actions"
import { getLoginState } from "../store/login/selectors"
import Button from "../ui/Button"
import FormField from "../ui/FormField"
import FullscreenRaisedPanel from "../ui/FullscreenRaisedPanel"
import { spacedChildrenVertical } from "../ui/helpers"
import ModalPanelHeader from "../ui/ModalPanelHeader"
import { styled } from "../ui/styled"
import TextInput from "../ui/TextInput"
import { spacing } from "../ui/theme"

function Login() {
  const { loading, error } = useAppSelector(getLoginState)
  const dispatch = useAppDispatch()

  const account = useInput()
  const password = useInput()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    dispatch(submitLogin(account.value, password.value))
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
