import { observer } from "mobx-react-lite"
import React, { ComponentPropsWithoutRef } from "react"
import { getProfileUrl } from "../flist/helpers"
import { useRootStore } from "../RootStore"
import BBC from "../ui/BBC"
import Box from "../ui/Box"
import ExternalLink from "../ui/ExternalLink"
import { styled } from "../ui/styled"
import { gapSizes } from "../ui/theme"
import Avatar from "./Avatar"
import { genderColors, statusColors } from "./colors"

type CharacterInfoProps = ComponentPropsWithoutRef<"div"> & {
  name: string
}

const CharacterInfo = ({ name, ...containerProps }: CharacterInfoProps) => {
  const { characterStore } = useRootStore()
  const { gender, status, statusMessage } = characterStore.characters.get(name)

  const nameStyle = { color: genderColors[gender] }
  const statusStyle = { color: statusColors[status] }

  return (
    <Box gap={gapSizes.small} {...containerProps}>
      <ExternalLink href={getProfileUrl(name)}>
        <h2 style={nameStyle}>{name}</h2>
      </ExternalLink>

      <ExternalLink href={getProfileUrl(name)}>
        <Avatar key={name} name={name} size={80} />
      </ExternalLink>

      <Box background="theme2" pad={gapSizes.xsmall}>
        <StatusText>
          <span style={statusStyle}>{status}</span>
          {statusMessage ? (
            <>
              {" "}
              - <BBC text={statusMessage} />
            </>
          ) : null}
        </StatusText>
      </Box>
    </Box>
  )
}

export default observer(CharacterInfo)

const StatusText = styled.span`
  font-style: italic;
  font-size: 80%;
`
