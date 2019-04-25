import React from "react"
import { withTheme } from "styled-components"
import Box from "./Box"
import { AppTheme } from "./theme.new"

const ModalPanel = (props: { children?: React.ReactNode; theme: AppTheme }) => (
  <Box background={props.theme.colors.theme} elevated>
    {props.children}
  </Box>
)

export default withTheme(ModalPanel)
