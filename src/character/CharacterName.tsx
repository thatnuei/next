import React from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { rainbowAnimation } from "../ui/helpers"
import CharacterMenuTarget from "./CharacterMenuTarget"
import { genderColors, statusColors } from "./colors"
import { useCharacter } from "./state"

type Props = TagProps<"span"> & {
  name: string
}

function CharacterName({ name, ...props }: Props) {
  const character = useCharacter(name)

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

export default CharacterName
