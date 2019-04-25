import { shade } from "polished"
import React from "react"
import { withTheme } from "styled-components"
import Box from "./Box"
import { AppTheme } from "./theme.new"

type Props = {
  children?: React.ReactNode
  theme: AppTheme
}

const ModalPanelHeader = (props: Props) => (
  <Box background={shade(0.3, props.theme.colors.theme)} pad="12px 24px">
    <h1>{props.children}</h1>
  </Box>
)

export default withTheme(ModalPanelHeader)
