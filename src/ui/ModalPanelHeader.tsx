import React from "react"
import { withTheme } from "styled-components"
import Box from "./Box"
import { styled } from "./styled"
import { AppTheme, spacing } from "./theme"

type Props = {
  children?: React.ReactNode
  theme: AppTheme
}

const ModalPanelHeader = (props: Props) => (
  <Box background="theme1" pad={spacing.small}>
    <Heading>{props.children}</Heading>
  </Box>
)

export default withTheme(ModalPanelHeader)

const Heading = styled.h1`
  text-align: center;
`
