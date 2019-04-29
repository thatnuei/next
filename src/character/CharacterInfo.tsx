import { observer } from "mobx-react-lite"
import React, { ComponentPropsWithoutRef } from "react"
import { getProfileUrl } from "../flist/helpers"
import { useRootStore } from "../RootStore"
import BBC from "../ui/BBC"
import Box from "../ui/Box"
import ExternalLink from "../ui/ExternalLink"
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
      <ExternalLink href={getProfileUrl(name)} style={nameStyle}>
        {name}
      </ExternalLink>

      <Avatar key={name} name={name} size={80} />

      <Box background="theme2" pad="xsmall" style={{ fontStyle: "italic" }}>
        <span style={statusStyle}>{status}</span>
        {statusMessage ? (
          <span>
            {" "}
            - <BBC text={statusMessage} />
          </span>
        ) : null}
      </Box>
    </Box>
  )
}

export default observer(CharacterInfo)
