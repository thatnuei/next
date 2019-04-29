import React from "react"
import Box from "../ui/Box"
import Icon from "../ui/Icon"
import { gapSizes } from "../ui/theme"

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
      background={props.active ? "theme0" : undefined}
      style={{ opacity: props.active ? 1 : 0.5 }}
    >
      <Box
        as="button"
        flex
        direction="row"
        gap={gapSizes.xsmall}
        pad={gapSizes.xsmall}
        align="center"
        onClick={onClick}
      >
        {props.icon}
        <Box flex pad={{ vertical: "xxsmall" }}>
          {props.title}
        </Box>
      </Box>

      {props.onClose && (
        <Box
          as="button"
          pad={gapSizes.xsmall}
          justify="center"
          onClick={props.onClose}
        >
          <Icon icon="close" size={0.7} />
        </Box>
      )}
    </Box>
  )
}
