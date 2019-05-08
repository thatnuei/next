import { observer } from "mobx-react-lite"
import React from "react"
import Box from "../ui/Box"
import { gapSizes } from "../ui/theme"
import OverlayCloseButton from "./OverlayCloseButton"
import OverlayContent from "./OverlayContent"

type Props = {
  children?: React.ReactNode
  maxWidth?: string | number
}

const OverlayPanel = (props: Props) => {
  return (
    <OverlayContent>
      <OverlayCloseButton />
      <Box width="100%" background="theme0" elevated>
        {props.children}
      </Box>
    </OverlayContent>
  )
}

export default observer(OverlayPanel)

export const OverlayPanelHeader = (props: { children?: React.ReactNode }) => (
  <Box background="theme1" pad={gapSizes.small} align="center">
    <h2>{props.children}</h2>
  </Box>
)
