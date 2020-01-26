import React, { ComponentPropsWithoutRef } from "react"
import ExternalLink from "../dom/components/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import {
  alignItems,
  alignSelf,
  bgMidnight,
  flex,
  mb,
  px,
  py,
} from "../ui/helpers.new"
import Avatar from "./Avatar"
import CharacterStatus from "./CharacterStatus"
import { genderColors } from "./colors"
import { CharacterStatus as CharacterStatusType, Gender } from "./types"

type CharacterInfoProps = ComponentPropsWithoutRef<"div"> & {
  name: string
  gender: Gender
  status: CharacterStatusType
  statusMessage: string
}

function CharacterInfo({
  name,
  gender,
  status,
  statusMessage,
  ...containerProps
}: CharacterInfoProps) {
  const nameStyle = { color: genderColors[gender] }

  return (
    <div css={[flex("column"), alignItems("flex-start")]} {...containerProps}>
      <ExternalLink href={getProfileUrl(name)} css={mb(2)}>
        <h2 style={nameStyle}>{name}</h2>
      </ExternalLink>

      <ExternalLink href={getProfileUrl(name)} css={mb(3)}>
        <Avatar name={name} size={80} />
      </ExternalLink>

      <div css={[bgMidnight(800), py(2), px(4), alignSelf("stretch")]}>
        <CharacterStatus status={status} statusMessage={statusMessage} />
      </div>
    </div>
  )
}

export default CharacterInfo
