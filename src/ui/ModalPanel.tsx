import { Box } from "grommet"
import React from "react"
import { ThemeColor } from "./theme"

const ModalPanel = (props: { children?: React.ReactNode }) => (
  <Box background={ThemeColor.bg} elevation="medium">
    {props.children}
  </Box>
)

export default ModalPanel
