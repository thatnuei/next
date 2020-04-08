import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import BBC from "../bbc/BBC"
import { TagProps } from "../jsx/types"
import { rainbowAnimation } from "../ui/helpers"
import { statusColors } from "./colors"
import { CharacterModel } from "./state"

type Props = TagProps<"p"> & {
  character: CharacterModel
}

function CharacterStatusText({ character, ...props }: Props) {
  return (
    <p css={tw`text-sm`} {...props}>
      <span
        css={[
          { color: statusColors[character.status] },
          character.status === "crown" && rainbowAnimation,
        ]}
      >
        {character.status === "crown" ? "awesome" : character.status}
      </span>
      {character.statusMessage ? (
        <BBC text={` - ${character.statusMessage}`} />
      ) : undefined}
    </p>
  )
}

export default observer(CharacterStatusText)
