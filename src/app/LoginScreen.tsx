import { observer } from "mobx-react-lite"
import React from "react"
import { useRootStore } from "../RootStore"
import useInput from "../state/useInput"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import FormField from "../ui/FormField"
import FullscreenScrollingContainer from "../ui/FullscreenScrollingContainer"
import Panel from "../ui/Panel"
import PanelHeader from "../ui/PanelHeader"
import { styled } from "../ui/styled"
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
      <FullscreenScrollingContainer>
        <Panel raised>
          <PanelHeader>next</PanelHeader>
          <PanelBody onSubmit={handleSubmit}>
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
          </PanelBody>
        </Panel>
      </FullscreenScrollingContainer>
    </AppDocumentTitle>
  )
}
export default observer(LoginScreen)

const PanelBody = styled.form`
  padding: 1rem;

  display: grid;
  grid-gap: 1.2rem;
  justify-items: start;
`
