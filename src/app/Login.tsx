import { observer } from "mobx-react-lite"
import React from "react"
import { useRootStore } from "../RootStore"
import useInput from "../state/useInput"
import Box from "../ui/Box"
import Button from "../ui/Button"
import FormField from "../ui/FormField"
import ModalPanelHeader from "../ui/ModalPanelHeader"
import TextInput from "../ui/TextInput"
import { spacing } from "../ui/theme"

function Login() {
  const { chatStore, viewStore } = useRootStore()
  const account = useInput()
  const password = useInput()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    try {
      await chatStore.submitLogin(account.value, password.value)
      viewStore.showCharacterSelect()
    } catch (error) {
      alert(error)
    }
  }

  return (
    <Box height="100vh" pad={spacing.large} style={{ overflowY: "auto" }}>
      <Box background="theme0" style={{ margin: "auto" }} elevated>
        <ModalPanelHeader>Login</ModalPanelHeader>
        <Box
          as="form"
          pad={spacing.small}
          gap={spacing.small}
          align="flex-start"
          onSubmit={handleSubmit}
        >
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
        </Box>
      </Box>
    </Box>
  )
}
export default observer(Login)