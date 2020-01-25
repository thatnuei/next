import React, { ComponentPropsWithoutRef } from "react"
import ExternalLink from "../dom/components/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import Box from "../ui/components/Box"
import { spacing } from "../ui/theme"
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
    <Box gap={spacing.small} align="flex-start" {...containerProps}>
      <ExternalLink href={getProfileUrl(name)}>
        <h2 style={nameStyle}>{name}</h2>
      </ExternalLink>

      <ExternalLink href={getProfileUrl(name)}>
        <Avatar name={name} size={80} />
      </ExternalLink>

      <Box background="theme2" pad={spacing.xsmall} alignSelf="stretch">
        <CharacterStatus status={status} statusMessage={statusMessage} />
      </Box>
    </Box>
  )
}

export default CharacterInfo
