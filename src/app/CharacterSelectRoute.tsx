import { navigate, Redirect, RouteComponentProps } from "@reach/router"
import React, { useContext, useEffect } from "react"
import Avatar from "../character/Avatar"
import Button from "../ui/Button"
import FormField from "../ui/FormField"
import ModalBody from "../ui/ModalBody"
import ModalOverlay from "../ui/ModalOverlay"
import ModalTitle from "../ui/ModalTitle"
import AppStore from "./AppStore"
import routePaths from "./routePaths"

type Props = RouteComponentProps

function CharacterSelectRoute(props: Props) {
  const { user, identity, setIdentity, restoreIdentity } = useContext(AppStore.Context)

  useEffect(() => {
    restoreIdentity()
  }, [])

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setIdentity(event.target.value)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!identity) setIdentity(identity)
    navigate(routePaths.chat)
  }

  if (!user) return <Redirect to={routePaths.login} />

  return (
    <ModalOverlay>
      <ModalTitle>Select a Character</ModalTitle>
      <ModalBody>
        <form onSubmit={handleSubmit} style={formStyle}>
          <FormField>
            <Avatar key={identity} name={identity} />
          </FormField>
          <FormField>
            <select name="character" value={identity} onChange={handleChange}>
              {user.characters.map((name) => (
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
  )
}
export default CharacterSelectRoute

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}
