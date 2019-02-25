import * as idb from "idb-keyval"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import Avatar from "../character/Avatar"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import FormField from "../ui/FormField"
import FullscreenCenterContainer from "../ui/FullscreenCenterContainer"
import PanelHeader from "../ui/PanelHeader"
import RaisedPanel from "../ui/RaisedPanel"
import { styled } from "../ui/styled"

const lastCharacterKey = (account: string) => `${account}:lastCharacter`

function CharacterSelectScreen() {
  const { userStore, viewStore, chatStore, socketStore } = useRootStore()

  const { characters } = userStore
  const { identity } = chatStore

  useEffect(() => {
    restoreIdentity()
  }, [])

  async function restoreIdentity() {
    const key = lastCharacterKey(userStore.account)
    const storedIdentity = await idb.get<string>(key)
    chatStore.setIdentity(storedIdentity || characters[0])
  }

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newIdentity = event.target.value
    chatStore.setIdentity(newIdentity)
    idb.set(lastCharacterKey(userStore.account), newIdentity)
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
      <FullscreenCenterContainer>
        <RaisedPanel>
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
        </RaisedPanel>
      </FullscreenCenterContainer>
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
