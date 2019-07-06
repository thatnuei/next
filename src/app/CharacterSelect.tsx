import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../character/Avatar"
import { useRootStore } from "../RootStore"
import useAsync from "../state/useAsync"
import Anchor from "../ui/Anchor"
import Button from "../ui/Button"
import FullscreenRaisedPanel from "../ui/FullscreenRaisedPanel"
import { spacedChildrenVertical } from "../ui/helpers"
import ModalPanelHeader from "../ui/ModalPanelHeader"
import Select from "../ui/Select"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"

function CharacterSelect() {
  const { viewStore, chatStore, socketStore } = useRootStore()
  const async = useAsync()

  const { characters, identity } = chatStore

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    chatStore.setIdentity(event.target.value)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    socketStore.connectToChat(() => {
      viewStore.showChat()
      viewStore.showChannel("Fantasy")
    }, showLogin)
  }

  function showLogin() {
    viewStore.showLogin()
  }

  return (
    <FullscreenRaisedPanel>
      <ModalPanelHeader>Select a Character</ModalPanelHeader>

      <Form onSubmit={handleSubmit}>
        <Avatar key={identity} name={identity} />

        <Select name="character" value={identity} onChange={handleChange}>
          {characters.map((name) => (
            <option value={name} key={name}>
              {name}
            </option>
          ))}
        </Select>

        <Button type="submit">Enter Chat</Button>

        <Anchor as="button" type="button" onClick={showLogin}>
          Return to Login
        </Anchor>
      </Form>
    </FullscreenRaisedPanel>
  )
}
export default observer(CharacterSelect)

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${spacing.small};
  ${spacedChildrenVertical()};
`
