import { Layer } from "grommet"
import * as idb from "idb-keyval"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import Avatar from "../character/Avatar"
import { useRootStore } from "../RootStore"
import Anchor from "../ui/Anchor"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import ModalPanel from "../ui/ModalPanel"
import ModalPanelHeader from "../ui/ModalPanelHeader"
import Select from "../ui/Select"
import { styled } from "../ui/styled"

const lastCharacterKey = (account: string) => `${account}:lastCharacter`

function CharacterSelectModal() {
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
      showLogin,
    )
  }

  function showLogin() {
    viewStore.showModal({ name: "login" })
  }

  return (
    <AppDocumentTitle title="Select Character">
      <Layer animate={false}>
        <ModalPanel>
          <ModalPanelHeader>Select a Character</ModalPanelHeader>

          <PanelBody onSubmit={handleSubmit}>
            <Avatar key={identity} name={identity} />

            <Select name="character" value={identity} onChange={handleChange}>
              {characters.map((name) => (
                <option value={name} key={name}>
                  {name}
                </option>
              ))}
            </Select>

            <Button primary type="submit" label="Enter Chat" />

            <Anchor as="button" type="button" onClick={showLogin}>
              Return to Login
            </Anchor>
          </PanelBody>
        </ModalPanel>
      </Layer>
    </AppDocumentTitle>
  )
}
export default observer(CharacterSelectModal)

const PanelBody = styled.form`
  padding: 1rem;

  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: max-content;
  justify-items: center;
  justify-content: center;
`
