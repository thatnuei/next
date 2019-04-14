import { Box, Heading } from "grommet"
import React from "react"
import { ThemeColor } from "./theme"

type Props = {
  children?: React.ReactNode
}

const ModalPanelHeader = (props: Props) => (
  <Box background={ThemeColor.bgDark} pad="small">
    <Heading level="1" textAlign="center">
      {props.children}
    </Heading>
  </Box>
)

export default ModalPanelHeader
