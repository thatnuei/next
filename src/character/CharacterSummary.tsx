import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { headerText2 } from "../ui/components"
import Avatar from "./Avatar"
import CharacterStatusText from "./CharacterStatusText"
import { genderColors } from "./colors"
import { CharacterModel } from "./state"

type Props = TagProps<"div"> & { character: CharacterModel }

function CharacterSummary({ character, ...props }: Props) {
  const genderColor = { color: genderColors[character.gender] }
  return (
    <div {...props}>
      <h1 css={[headerText2, genderColor, tw`leading-none`]}>
        {character.name}
      </h1>
      <Avatar name={character.name} css={tw`my-3`} />
      <CharacterStatusText
        character={character}
        css={[
          tw`px-3 py-2 overflow-y-auto bg-background-1`,
          { maxHeight: 100 }, // some statuses can get really big
        ]}
      />
    </div>
  )
}

export default observer(CharacterSummary)
