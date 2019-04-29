import React from "react"
import Box from "../ui/Box"
import FadedButton from "../ui/FadedButton"
import Icon from "../ui/Icon"
import { css, styled } from "../ui/styled"
import { gapSizes } from "../ui/theme"

type Props = {
  icon?: React.ReactNode
  title?: React.ReactNode
  active?: boolean
  onClick?: () => void
  onClose?: () => void
}

export default function RoomTab({ onClick = () => {}, ...props }: Props) {
  return (
    <Box direction="row" background={props.active ? "theme0" : undefined}>
      <TitleButton active={props.active}>
        <Box
          direction="row"
          gap={gapSizes.xsmall}
          pad={gapSizes.xsmall}
          align="center"
          onClick={onClick}
        >
          {props.icon}
          <Box flex pad={{ vertical: "xxsmall" }}>
            {props.title}
          </Box>
        </Box>
      </TitleButton>

      {props.onClose && (
        <Box
          as={FadedButton}
          pad={gapSizes.xsmall}
          justify="center"
          onClick={props.onClose}
        >
          <Icon icon="close" size={0.7} />
        </Box>
      )}
    </Box>
  )
}

const TitleButton = styled.button<{ active?: boolean }>`
  ${(props) => (props.active ? "" : inactiveStyle)};

  flex: 1;

  :focus {
    outline: none;
  }
`

const inactiveStyle = css`
  cursor: pointer;
  transition: 0.2s;
  opacity: 0.4;

  :hover,
  :focus {
    opacity: 0.7;
  }
`
