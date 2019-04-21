import { Box, Text } from "grommet"
import React from "react"
import Icon from "../ui/Icon"
import { ThemeColor } from "../ui/theme"

type Props = {
  icon?: React.ReactNode
  title?: React.ReactNode
  active?: boolean
  onClick?: () => void
  onClose?: () => void
}

export default function RoomTab({ onClick = () => {}, ...props }: Props) {
  return (
    <Box
      direction="row"
      background={props.active ? ThemeColor.bg : undefined}
      style={{ opacity: props.active ? 1 : 0.5 }}
    >
      <Box
        as="button"
        flex
        direction="row"
        gap="xsmall"
        pad="xsmall"
        align="center"
        onClick={onClick}
      >
        {props.icon}
        <Box flex pad={{ vertical: "xxsmall" }}>
          <Text>{props.title}</Text>
        </Box>
      </Box>

      {props.onClose && (
        <Box as="button" pad="xsmall" justify="center" onClick={props.onClose}>
          <Icon icon="close" size={0.7} />
        </Box>
      )}
    </Box>
  )
}
