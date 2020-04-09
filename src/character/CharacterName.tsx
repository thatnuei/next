import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import ExternalLink from "../dom/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import { TagProps } from "../jsx/types"
import { rainbowAnimation } from "../ui/helpers"
import { genderColors, statusColors } from "./colors"
import { CharacterModel } from "./state"

type Props = TagProps<"span"> & {
  character: CharacterModel
}

function CharacterName({ character, ...props }: Props) {
  const statusDotStyle = [
    tw`inline-block mr-1 transform scale-150`,
    { color: statusColors[character.status] },
    character.status === "crown" && rainbowAnimation,
  ]

  return (
    <ExternalLink
      href={getProfileUrl(character.name)}
      css={tw`font-weight-bold`}
      {...props}
      data-character={character.name}
    >
      <span css={statusDotStyle}>•</span>
      <span css={{ color: genderColors[character.gender] }}>
        {character.name}
      </span>
    </ExternalLink>
  )
}

export default observer(CharacterName)
