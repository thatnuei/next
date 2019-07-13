import { observer } from "mobx-react-lite"
import React, { ComponentPropsWithoutRef } from "react"
import { getProfileUrl } from "../flist/helpers"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import ExternalLink from "../ui/ExternalLink"
import { spacing } from "../ui/theme"
import Avatar from "./Avatar"
import CharacterStatus from "./CharacterStatus"
import { genderColors } from "./colors"

type CharacterInfoProps = ComponentPropsWithoutRef<"div"> & {
  name: string
}

const CharacterInfo = ({ name, ...containerProps }: CharacterInfoProps) => {
  const { characterStore } = useRootStore()
  const { gender } = characterStore.characters.get(name)

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

export default observer(CharacterInfo)
