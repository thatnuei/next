import React from "react"
import { headerText2 } from "../ui/components"
import { leadingNone, my, px, py, themeBgColor } from "../ui/style"
import Avatar from "./Avatar"
import CharacterStatusText from "./CharacterStatusText"
import { genderColors } from "./colors"
import { Character } from "./types"

type Props = { character: Character }

function CharacterDetails({ character }: Props) {
  const genderColor = { color: genderColors[character.gender] }
  return <>
    <p>{character.name}</p>
    <Avatar name={character.name} />
    <div>
      <CharacterStatusText {...character} />
    </div>
  </>;
}

export default CharacterDetails
