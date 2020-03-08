import React, { useState } from "react"
import Avatar from "../character/Avatar"
import Button from "../dom/Button"
import {
  anchor,
  headerText,
  raisedPanel,
  raisedPanelHeader,
  select,
  solidButton,
} from "../ui/components"
import {
  alignItems,
  fixedCover,
  flexCenter,
  flexColumn,
  mt,
  my,
  p,
} from "../ui/style"

type Props = {
  characters: string[]
  initialCharacter: string
  onSubmit: (character: string) => void
  onReturnToLogin: () => void
}

function CharacterSelect(props: Props) {
  const [character, setCharacter] = useState(props.initialCharacter)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    props.onSubmit(character)
  }

  return (
    <div>
      <div>
        <header>
          <h1>Select a Character</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <Avatar name={character} />
          <select value={character} onChange={(e) => setCharacter(e.target.value)}>
            {props.characters.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <Button type="submit">
            Enter chat
          </Button>
          <Button onClick={props.onReturnToLogin}>
            Return to Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CharacterSelect
