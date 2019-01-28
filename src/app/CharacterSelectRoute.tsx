import React from "react"
import Avatar from "../character/Avatar"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import FormField from "../ui/FormField"
import ModalBody from "../ui/ModalBody"
import ModalOverlay from "../ui/ModalOverlay"
import ModalTitle from "../ui/ModalTitle"

type Props = {
  characters: string[]
  identity: string
  onIdentityChange: (identity: string) => void
  onSubmit: () => void
}

function CharacterSelectRoute(props: Props) {
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    props.onIdentityChange(event.target.value)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    props.onSubmit()
  }

  return (
    <AppDocumentTitle title="Select Character">
      <ModalOverlay>
        <ModalTitle>Select a Character</ModalTitle>
        <ModalBody>
          <form onSubmit={handleSubmit} style={formStyle}>
            <FormField>
              <Avatar key={props.identity} name={props.identity} />
            </FormField>
            <FormField>
              <select
                name="character"
                value={props.identity}
                onChange={handleChange}
              >
                {props.characters.map((name) => (
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
