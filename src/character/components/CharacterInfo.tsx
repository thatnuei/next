import React, { ComponentPropsWithoutRef } from "react"
import ExternalLink from "../../dom/components/ExternalLink"
import { getProfileUrl } from "../../flist/helpers"
import { useSelector } from "../../store/hooks"
import { getCharacter } from "../../store/selectors"
import Box from "../../ui/components/Box"
import { spacing } from "../../ui/theme"
import Avatar from "./Avatar"
import CharacterStatus from "./CharacterStatus"
import { genderColors } from "./colors"

type CharacterInfoProps = ComponentPropsWithoutRef<"div"> & {
  name: string
}

function CharacterInfo({ name, ...containerProps }: CharacterInfoProps) {
  const { gender } = useSelector(getCharacter(name))

  const nameStyle = { color: genderColors[gender] }

  return (
    <Box gap={spacing.small} align="flex-start" {...containerProps}>
      <ExternalLink href={getProfileUrl(name)}>
        <h2 style={nameStyle}>{name}</h2>
      </ExternalLink>

      <ExternalLink href={getProfileUrl(name)}>
        <Avatar key={name} name={name} size={80} />
      </ExternalLink>

      <Box background="theme2" pad={spacing.xsmall} alignSelf="stretch">
        <CharacterStatus name={name} />
      </Box>
    </Box>
  )
}

export default CharacterInfo
