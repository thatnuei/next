import { observer } from "mobx-react-lite"
import React from "react"
import { useRootStore } from "../RootStore"
import useInput from "../state/useInput"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import FormField from "../ui/FormField"
import ModalBody from "../ui/ModalBody"
import ModalOverlay from "../ui/ModalOverlay"
import ModalTitle from "../ui/ModalTitle"
import TextInput from "../ui/TextInput"

function LoginScreen() {
  const { userStore, viewStore } = useRootStore()
  const account = useInput()
  const password = useInput()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    try {
      await userStore.submitLogin(account.value, password.value)
      viewStore.setScreen({ name: "characterSelect" })
    } catch (error) {
      alert(error)
    }
  }

  return (
    <AppDocumentTitle title="Login">
      <ModalOverlay>
        <ModalTitle>next</ModalTitle>
        <ModalBody css={{ width: "100%" }}>
          <form onSubmit={handleSubmit}>
            <FormField labelText="Username">
              <TextInput placeholder="awesomeuser" {...account.bind} />
            </FormField>
            <FormField labelText="Password">
              <TextInput
                type="password"
                placeholder="••••••••"
                {...password.bind}
              />
            </FormField>
            <Button type="submit">Submit</Button>
          </form>
        </ModalBody>
      </ModalOverlay>
    </AppDocumentTitle>
  )
}
export default observer(LoginScreen)