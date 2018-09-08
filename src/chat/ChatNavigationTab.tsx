import { mdiClose } from "@mdi/js"
import React from "react"
import { Avatar } from "../character/Avatar"
import { flist4 } from "../ui/colors"
import { Icon } from "../ui/Icon"
import { css, styled } from "../ui/styled"

type ChatNavigationTabProps = {
  text: string
  active?: boolean
  icon?: string
  avatar?: string
  onActivate?: () => void
  onClose?: () => void
}

// TODO: turn into class w/ methods for handlers
export const ChatNavigationTab = (props: ChatNavigationTabProps) => {
  return (
    <Container {...props}>
      <TitleContainer {...props} onMouseDown={() => props.onActivate && props.onActivate()}>
        <IconContainer>
          {props.icon && <Icon path={props.icon} />}
          {props.avatar && <Avatar name={props.avatar} size={24} />}
        </IconContainer>
        <TitleText>{props.text}</TitleText>
      </TitleContainer>
      {props.onClose && (
        <CloseButton {...props} onMouseDown={() => props.onClose && props.onClose()}>
          <Icon path={mdiClose} size={0.8} />
        </CloseButton>
      )}
    </Container>
  )
}

const Container = styled.div<ChatNavigationTabProps>`
  display: flex;
  align-items: center;

  background-color: ${(props) => (props.active ? flist4 : "transparent")};
`

const inactiveStyle = css`
  opacity: 0.3;

  &:hover {
    opacity: 0.5;
  }
`

const TitleContainer = styled.a.attrs({ href: "#" })<ChatNavigationTabProps>`
  flex-grow: 1;

  padding: 0.6rem 0.6rem;

  display: flex;
  align-items: center;

  ${(props) => (props.active ? "" : inactiveStyle)};
`

const IconContainer = styled.div`
  padding-right: 0.4rem;

  /* to remove the random spacing on the icon */
  svg,
  img {
    display: block;
  }
`

const TitleText = styled.div`
  /* fixes vertial alignment */
  position: relative;
  top: 1px;
`

const CloseButton = styled.a.attrs({ href: "#" })<ChatNavigationTabProps>`
  padding: 0.3rem 0.4rem;
  flex-shrink: 0;

  /* to remove the random spacing on the icon */
  svg,
  img {
    display: block;
  }

  ${(props) => (props.active ? "" : inactiveStyle)};
`
