import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { rainbowAnimation } from "../ui/helpers"
import CharacterMenuTarget from "./CharacterMenuTarget"
import { CharacterState } from "./CharacterState"
import { genderColors, statusColors } from "./colors"

type Props = TagProps<"span"> & {
  character: CharacterState
}

function CharacterName({ character, ...props }: Props) {
  const statusDotStyle = [
    tw`inline-block mr-1 transform scale-150`,
    { color: statusColors[character.status] },
    character.status === "crown" && rainbowAnimation,
  ]

  return (
    <CharacterMenuTarget
      name={character.name}
      css={tw`font-weight-bold`}
      {...props}
    >
      <span css={statusDotStyle}>•</span>
      <span css={{ color: genderColors[character.gender] }}>
        {character.name}
      </span>
    </CharacterMenuTarget>
  )
}

export default observer(CharacterName)
