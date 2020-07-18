import React from "react"
import tw from "twin.macro"
import BBC from "../bbc/BBC"
import { TagProps } from "../jsx/types"
import { rainbowAnimation } from "../ui/helpers"
import { statusColors } from "./colors"
import { useCharacter } from "./state"

type Props = TagProps<"p"> & {
  name: string
}

function CharacterStatusText({ name, ...props }: Props) {
  const character = useCharacter(name)
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

export default CharacterStatusText
