import React from "react"
import { withTheme } from "styled-components"
import Box from "./Box"
import { styled } from "./styled"
import { AppTheme, gapSizes } from "./theme.new"

type Props = {
  children?: React.ReactNode
  theme: AppTheme
}

const ModalPanelHeader = (props: Props) => (
  <Box background="theme1" pad={gapSizes.small}>
    <Heading>{props.children}</Heading>
  </Box>
)

export default withTheme(ModalPanelHeader)

const Heading = styled.h1`
  text-align: center;
`
