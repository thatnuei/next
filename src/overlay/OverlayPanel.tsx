import { observer } from "mobx-react-lite"
import React from "react"
import Box, { BoxProps } from "../ui/Box"
import { gapSizes } from "../ui/theme"
import OverlayCloseButton from "./OverlayCloseButton"
import OverlayContent from "./OverlayContent"

type Props = {
  children?: React.ReactNode
  maxWidth?: string | number
}

const OverlayPanel = (props: Props) => {
  return (
    <OverlayContent maxWidth={props.maxWidth}>
      <OverlayCloseButton />
      <Box width="100%" background="theme0" elevated>
        {props.children}
      </Box>
    </OverlayContent>
  )
}

export default observer(OverlayPanel)

export const OverlayPanelHeader = (props: BoxProps) => (
  <Box background="theme1" pad={gapSizes.small} align="center" {...props}>
    <h2>{props.children}</h2>
  </Box>
)
