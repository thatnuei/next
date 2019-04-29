import React from "react"
import { withTheme } from "styled-components"
import Box from "./Box"
import { AppTheme } from "./theme"

const ModalPanel = (props: { children?: React.ReactNode; theme: AppTheme }) => (
  <Box background="theme0" elevated>
    {props.children}
  </Box>
)

export default withTheme(ModalPanel)
