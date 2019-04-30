import React from "react"
import { onlyOnSelf } from "../common/eventHelpers"
import Box from "./Box"
import { semiBlack } from "./colors"
import FadedButton from "./FadedButton"
import { fullscreen } from "./helpers"
import Icon from "./Icon"
import { styled } from "./styled"
import { gapSizes } from "./theme"

type ModalOverlayProps = {
  children?: React.ReactNode
  isVisible?: boolean
  onClose?: () => void
}

const ModalOverlay = (props: ModalOverlayProps) => {
  return (
    <Shade
      pad={gapSizes.large}
      overflowY="auto"
      isVisible={props.isVisible}
      onClick={onlyOnSelf(props.onClose)}
    >
      <ContentContainer
        gap={gapSizes.xsmall}
        align="flex-end"
        isVisible={props.isVisible}
      >
        <FadedButton onClick={props.onClose}>
          <Icon icon="close" />
        </FadedButton>
        {props.children}
      </ContentContainer>
    </Shade>
  )
}

export default ModalOverlay

const Shade = styled(Box)<{ isVisible?: boolean }>`
  ${fullscreen}
  background-color: ${semiBlack(0.5)};
  z-index:1;
  transition: 0.2s;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
`

const ContentContainer = styled(Box)<{ isVisible?: boolean }>`
  margin: auto;
  transition: 0.2s;
  transform: translateY(${(props) => (props.isVisible ? 0 : "-16px")});
`
