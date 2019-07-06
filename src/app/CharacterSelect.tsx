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
  const { api, viewStore, chatStore, socketHandler } = useRootStore()
  const async = useAsync()

  const { characters, identity } = chatStore

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    chatStore.setIdentity(event.target.value)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    // probably move all the below to the chatStore(?)
    await socketHandler.connect({
      account: api.account,
      ticket: api.ticket,
      character: identity,
    })

    viewStore.showChat()
    viewStore.showChannel("Fantasy")
  }

  function showLogin() {
    viewStore.showLogin()
  }

  return (
    <FullscreenRaisedPanel>
      <ModalPanelHeader>Select a Character</ModalPanelHeader>

      <form onSubmit={async.bind(handleSubmit)}>
        <FieldSet disabled={async.loading}>
          <FieldsContainer>
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
          </FieldsContainer>
        </FieldSet>
      </form>
    </FullscreenRaisedPanel>
  )
}
export default observer(CharacterSelect)

const FieldSet = styled.fieldset`
  transition: 0.2s opacity;
  :disabled {
    opacity: 0.5;
  }
`

// fieldsets can't be flex containers https://stackoverflow.com/a/28078942/1332403
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: ${spacing.medium};
  ${spacedChildrenVertical(spacing.medium)};
`
