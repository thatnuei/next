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
    <div css={[fixedCover, flexColumn, flexCenter]}>
      <div css={raisedPanel}>
        <header css={raisedPanelHeader}>
          <h1 css={headerText}>Select a Character</h1>
        </header>
        <form
          css={[flexColumn, alignItems("center"), p(4)]}
          onSubmit={handleSubmit}
        >
          <Avatar name={character} />
          <select
            css={[select, my(4)]}
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
          >
            {props.characters.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <Button css={solidButton} type="submit">
            Enter chat
          </Button>
          <Button css={[anchor, mt(4)]} onClick={props.onReturnToLogin}>
            Return to Login
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CharacterSelect
