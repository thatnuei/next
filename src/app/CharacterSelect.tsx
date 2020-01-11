import React from "react"
import Avatar from "../character/Avatar"
import Anchor from "../ui/components/Anchor"
import Button from "../ui/components/Button"
import FullscreenRaisedPanel from "../ui/components/FullscreenRaisedPanel"
import RaisedPanelHeader from "../ui/components/RaisedPanelHeader"
import Select from "../ui/components/Select"
import { spacedChildrenVertical } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"

type Props = {
  identity: string
  characters: string[]
  onIdentityChange: (identity: string) => void
  onSubmit: () => void
  onReturnToLogin: () => void
}

export default function CharacterSelect(props: Props) {
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    props.onIdentityChange(event.target.value)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    props.onSubmit()
  }

  return (
    <FullscreenRaisedPanel>
      <RaisedPanelHeader center={<h1>Select a Character</h1>} />
      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldsContainer>
            <Avatar key={props.identity} name={props.identity} />

            <Select
              name="character"
              value={props.identity}
              onChange={handleChange}
            >
              {props.characters.map((name) => (
                <option value={name} key={name}>
                  {name}
                </option>
              ))}
            </Select>

            <Button type="submit">Enter Chat</Button>

            <Anchor as="button" type="button" onClick={props.onReturnToLogin}>
              Return to Login
            </Anchor>
          </FieldsContainer>
        </FieldSet>
      </form>
    </FullscreenRaisedPanel>
  )
}

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
