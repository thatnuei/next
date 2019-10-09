import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../../character/components/Avatar"
import Anchor from "../../ui/components/Anchor"
import Button from "../../ui/components/Button"
import FullscreenRaisedPanel from "../../ui/components/FullscreenRaisedPanel"
import RaisedPanelHeader from "../../ui/components/RaisedPanelHeader"
import Select from "../../ui/components/Select"
import { spacedChildrenVertical } from "../../ui/helpers"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import useRootStore from "../../useRootStore"

function CharacterSelect() {
  const {
    appStore: { showLogin },
    chatStore: { identity, setIdentity, connectToChat, isConnecting },
    userStore: { characters },
  } = useRootStore()

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setIdentity(event.target.value)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    connectToChat()
  }

  return (
    <FullscreenRaisedPanel>
      <RaisedPanelHeader center={<h1>Select a Character</h1>} />
      <form onSubmit={handleSubmit}>
        <FieldSet disabled={isConnecting}>
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
