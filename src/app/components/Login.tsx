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

type Props = {
  disabled: boolean
  error?: string
  onSubmit: (account: string, password: string) => void
}

function Login({ disabled, error, onSubmit }: Props) {
  const account = useInput()
  const password = useInput()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSubmit(account.value, password.value)
  }

  return (
    <FullscreenRaisedPanel>
      <RaisedPanelHeader center={<h1>Login</h1>} />
      <Form onSubmit={handleSubmit}>
        <FieldSet disabled={disabled}>
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
