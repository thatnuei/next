import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { CharacterModel } from "./CharacterModel"
import { genderColors, statusColors } from "./colors"

type Props = TagProps<"span"> & {
  character: CharacterModel
}

function CharacterName({ character }: Props) {
  return (
    <span css={tw`font-weight-bold`}>
      {character.status && (
        <span css={[{ color: statusColors[character.status] }, statusDotStyle]}>
          •
        </span>
      )}
      <span css={{ color: genderColors[character.gender] }}>
        {character.name}
      </span>
    </span>
  )
}

export default observer(CharacterName)

const statusDotStyle = tw`inline-block mr-1 transform scale-150`
