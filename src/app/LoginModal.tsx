import { Box, Layer, TextInput } from "grommet"
import { observer } from "mobx-react-lite"
import React from "react"
import { useRootStore } from "../RootStore"
import useInput from "../state/useInput"
import Button from "../ui/Button"
import FormField from "../ui/FormField"
import ModalPanel from "../ui/ModalPanel"
import ModalPanelHeader from "../ui/ModalPanelHeader"

function LoginModal() {
  const { userStore, viewStore } = useRootStore()
  const account = useInput()
  const password = useInput()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    try {
      await userStore.submitLogin(account.value, password.value)
      viewStore.showModal({ name: "character-select" })
    } catch (error) {
      alert(error)
    }
  }

  return (
    <Layer animate={false}>
      <ModalPanel>
        <ModalPanelHeader>Login</ModalPanelHeader>

        <Box
          as="form"
          pad="small"
          gap="small"
          align="start"
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

          <Button primary type="submit" label="Submit" />
        </Box>
      </ModalPanel>
    </Layer>
  )
}
export default observer(LoginModal)
