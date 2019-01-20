import React, { useContext } from "react"
import { useRouter } from "../router"
import useInput from "../state/useInput"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import FormField from "../ui/FormField"
import ModalBody from "../ui/ModalBody"
import ModalOverlay from "../ui/ModalOverlay"
import ModalTitle from "../ui/ModalTitle"
import TextInput from "../ui/TextInput"
import AppStore from "./AppStore"
import routePaths from "./routePaths"

function LoginRoute() {
  const appState = useContext(AppStore.Context)
  const account = useInput()
  const password = useInput()
  const { history } = useRouter()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    try {
      await appState.submitLogin(account.value, password.value)
      history.push(routePaths.characterSelect)
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
              <TextInput type="password" placeholder="••••••••" {...password.bind} />
            </FormField>
            <Button type="submit">Submit</Button>
          </form>
        </ModalBody>
      </ModalOverlay>
    </AppDocumentTitle>
  )
}
export default LoginRoute
