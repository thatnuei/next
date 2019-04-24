import { Box, Heading, Text } from "grommet"
import { observer } from "mobx-react-lite"
import React, { ComponentPropsWithoutRef } from "react"
import { getProfileUrl } from "../flist/helpers"
import { useRootStore } from "../RootStore"
import BBC from "../ui/BBC"
import ExternalLink from "../ui/ExternalLink"
import { ThemeColor } from "../ui/theme"
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
    <Box gap="small" {...containerProps}>
      <ExternalLink href={getProfileUrl(name)}>
        <Heading level="2" style={nameStyle}>
          {name}
        </Heading>
      </ExternalLink>

      <Avatar key={name} name={name} size={80} />

      <Box background={ThemeColor.bgShaded} pad="xsmall">
        <Text size="small" style={{ fontStyle: "italic" }}>
          <span style={statusStyle}>{status}</span>
          {statusMessage ? (
            <span>
              {" "}
              - <BBC text={statusMessage} />
            </span>
          ) : null}
        </Text>
      </Box>
    </Box>
  )
}

export default observer(CharacterInfo)
