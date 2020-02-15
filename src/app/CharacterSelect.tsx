import React, { useState } from "react"
import Avatar from "../character/Avatar"
import { headerText, input, solidButton } from "../ui/components"
import {
  alignItems,
  fixedCover,
  flexCenter,
  flexColumn,
  my,
  p,
  px,
  py,
  textCenter,
  themeBgColor,
  themeShadow,
} from "../ui/style"

type Props = {
  characters: string[]
  initialCharacter: string
  onSubmit: (character: string) => void
}

function CharacterSelect(props: Props) {
  const [character, setCharacter] = useState(props.initialCharacter)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    props.onSubmit(character)
  }

  return (
    <main css={[fixedCover, flexCenter]}>
      <div css={[themeShadow, themeBgColor(0)]}>
        <h1 css={[themeBgColor(1), py(2), px(4), headerText, textCenter]}>
          Select a Character
        </h1>
        <form
          css={[flexColumn, alignItems("center"), p(4)]}
          onSubmit={handleSubmit}
        >
          <Avatar name={character} />
          <select
            css={[input, { boxShadow: "none" }, my(4)]}
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
          >
            {props.characters.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          <button css={solidButton} type="submit">
            Enter chat
          </button>
        </form>
      </div>
    </main>
  )
}

export default CharacterSelect
