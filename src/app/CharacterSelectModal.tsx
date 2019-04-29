import * as idb from "idb-keyval"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import Avatar from "../character/Avatar"
import { useRootStore } from "../RootStore"
import Anchor from "../ui/Anchor"
import Box from "../ui/Box"
import Button from "../ui/Button"
import ModalPanel from "../ui/ModalPanel"
import ModalPanelHeader from "../ui/ModalPanelHeader"
import Select from "../ui/Select"
import { gapSizes } from "../ui/theme"

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
    socketStore.connectToChat(() => {
      viewStore.showChat()
      viewStore.showChannel("Fantasy")
    }, showLogin)
  }

  function showLogin() {
    viewStore.showLogin()
  }

  return (
    <Box height="100vh" align="center" justify="center">
      <ModalPanel>
        <ModalPanelHeader>Select a Character</ModalPanelHeader>

        <Box
          as="form"
          align="center"
          gap={gapSizes.medium}
          pad={gapSizes.medium}
          onSubmit={handleSubmit}
        >
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
        </Box>
      </ModalPanel>
    </Box>
  )
}
export default observer(CharacterSelectModal)
