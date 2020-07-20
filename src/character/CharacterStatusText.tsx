import { useObservable } from "micro-observables"
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
  const status = useObservable(character.status)

  return (
    <p css={tw`text-sm`} {...props}>
      <span
        css={[
          { color: statusColors[status.type] },
          status.type === "crown" && rainbowAnimation,
        ]}
      >
        {status.type === "crown" ? "awesome" : status.type}
      </span>
      {status.text ? <BBC text={` - ${status.text}`} /> : undefined}
    </p>
  )
}

export default CharacterStatusText
