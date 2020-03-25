import React from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { genderColors, statusColors } from "./colors"
import { CharacterGender, CharacterStatus } from "./types"

type Props = TagProps<"span"> & {
  name: string
  gender: CharacterGender
  status?: CharacterStatus
}

function CharacterName({ name, gender, status }: Props) {
  return (
    <span css={tw`font-weight-bold`}>
      {status && (
        <span css={[{ color: statusColors[status] }, statusDotStyle]}>•</span>
      )}
      <span css={{ color: genderColors[gender] }}>{name}</span>
    </span>
  )
}

export default CharacterName

const statusDotStyle = tw`inline-block mr-1 transform scale-150`
