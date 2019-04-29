import { cover } from "polished"
import React from "react"
import Box from "../ui/Box"
import FadedButton from "../ui/FadedButton"
import Icon from "../ui/Icon"
import { styled } from "../ui/styled"
import { gapSizes } from "../ui/theme"

type Props = {
  children: React.ReactNode
  isVisible: boolean
  onClose: () => void
}

const ChannelDescriptionOverlay = (props: Props) => {
  const handleShadeClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      props.onClose()
    }
  }

  return (
    <Shade
      pad={gapSizes.small}
      isVisible={props.isVisible}
      onClick={handleShadeClick}
    >
      <ShadeContent isVisible={props.isVisible} gap={gapSizes.small}>
        <FadedButton
          onClick={props.onClose}
          style={{ alignSelf: "flex-start" }}
        >
          <Icon icon="close" />
        </FadedButton>
        <Box
          background="theme0"
          elevated
          pad={gapSizes.small}
          style={{ maxHeight: "45vh" }}
          overflowY="auto"
        >
          {props.children}
        </Box>
      </ShadeContent>
    </Shade>
  )
}

export default ChannelDescriptionOverlay

type VisibilityProps = { isVisible: boolean }

const Shade = styled(Box)<VisibilityProps>`
  ${cover()};
  background-color: rgba(0, 0, 0, 0.7);

  transition: 0.2s;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};

  z-index: 1;
`

const ShadeContent = styled(Box)<VisibilityProps>`
  transition: 0.2s;
  transform: translateY(${(props) => (props.isVisible ? 0 : "-16px")});

  /* ignore click events on this element, but not the children */
  pointer-events: none;
  > * {
    pointer-events: all;
  }
`
