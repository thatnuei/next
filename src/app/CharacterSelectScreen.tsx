import * as idb from "idb-keyval"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import Avatar from "../character/Avatar"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import FormField from "../ui/FormField"
import FullscreenScrollingContainer from "../ui/FullscreenScrollingContainer"
import Panel from "../ui/Panel"
import PanelHeader from "../ui/PanelHeader"
import { styled } from "../ui/styled"

const lastCharacterKey = (account: string) => `${account}:lastCharacter`

function CharacterSelectScreen() {
  const { userStore, viewStore, chatStore, socketStore } = useRootStore()

  const { characters, account } = userStore
  const { identity } = chatStore

  useEffect(() => {
    async function restoreIdentity() {
      const key = lastCharacterKey(account)
      const storedIdentity = await idb.get<string>(key)
      chatStore.setIdentity(storedIdentity || characters[0])
    }
    restoreIdentity()
  }, [characters, chatStore, account])

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newIdentity = event.target.value
    chatStore.setIdentity(newIdentity)
    idb.set(lastCharacterKey(account), newIdentity)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    socketStore.connectToChat(
      () => viewStore.setScreen({ name: "channel", channel: "Fantasy" }),
      () => viewStore.setScreen({ name: "login" }),
    )
  }

  return (
    <AppDocumentTitle title="Select Character">
      <FullscreenScrollingContainer>
        <Panel raised>
          <PanelHeader>Select a Character</PanelHeader>
          <PanelBody onSubmit={handleSubmit}>
            <FormField>
              <Avatar key={identity} name={identity} />
            </FormField>
            <FormField>
              <select name="character" value={identity} onChange={handleChange}>
                {characters.map((name) => (
                  <option value={name} key={name}>
                    {name}
                  </option>
                ))}
              </select>
            </FormField>
            <Button type="submit">Enter Chat</Button>
          </PanelBody>
        </Panel>
      </FullscreenScrollingContainer>
    </AppDocumentTitle>
  )
}
export default observer(CharacterSelectScreen)

const PanelBody = styled.form`
  padding: 1rem;

  display: flex;
  flex-direction: column;
  align-items: center;
`
