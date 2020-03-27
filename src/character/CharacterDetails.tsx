import React from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { headerText2 } from "../ui/components"
import Avatar from "./Avatar"
import CharacterStatusText from "./CharacterStatusText"
import { genderColors } from "./colors"
import { Character } from "./types"

type Props = TagProps<"div"> & { character: Character }

function CharacterDetails({ character, ...props }: Props) {
  const genderColor = { color: genderColors[character.gender] }
  return (
    <div {...props}>
      <h1 css={[headerText2, genderColor, tw`leading-none`]}>
        {character.name}
      </h1>
      <Avatar name={character.name} css={tw`my-3`} />
      <CharacterStatusText
        status={character.status}
        statusMessage={character.statusMessage}
        css={tw`px-3 py-2 bg-background-1`}
      />
    </div>
  )
}

export default CharacterDetails
