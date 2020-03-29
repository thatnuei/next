import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { CharacterModel } from "./CharacterModel"
import { statusColors } from "./colors"

type Props = TagProps<"p"> & {
  character: CharacterModel
}

function CharacterStatusText({ character, ...props }: Props) {
  return (
    <p css={tw`text-sm italic`} {...props}>
      <span css={{ color: statusColors[character.status] }}>
        {character.status}
      </span>
      {character.statusMessage ? ` - ${character.statusMessage}` : undefined}
    </p>
  )
}

export default observer(CharacterStatusText)
