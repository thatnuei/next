import React, { useContext } from "react"
import Avatar from "../character/Avatar"
import { Redirect, useRouter } from "../router"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import FormField from "../ui/FormField"
import ModalBody from "../ui/ModalBody"
import ModalOverlay from "../ui/ModalOverlay"
import ModalTitle from "../ui/ModalTitle"
import AppStore from "./AppStore"
import routePaths from "./routePaths"

function CharacterSelectRoute() {
  const { userCharacters: characters, identity, setIdentity } = useContext(AppStore.Context)
  const { history } = useRouter()

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setIdentity(event.target.value)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    history.push(routePaths.chat)
  }

  if (!characters || !identity) return <Redirect to={routePaths.login} />

  return (
    <AppDocumentTitle title="Select Character">
      <ModalOverlay>
        <ModalTitle>Select a Character</ModalTitle>
        <ModalBody>
          <form onSubmit={handleSubmit} style={formStyle}>
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
          </form>
        </ModalBody>
      </ModalOverlay>
    </AppDocumentTitle>
  )
}
export default CharacterSelectRoute

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}
