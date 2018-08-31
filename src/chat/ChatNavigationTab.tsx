import { mdiClose } from "@mdi/js"
import { Icon } from "@mdi/react"
import React from "react"
import { Avatar } from "../character/Avatar"
import { clouds, flist4 } from "../ui/colors"
import { css, styled } from "../ui/styled"

type ChatNavigationTabProps = {
  text: string
  active?: boolean
  icon?: string
  avatar?: string
}

export const ChatNavigationTab = (props: ChatNavigationTabProps) => {
  return (
    <Container {...props}>
      <TitleContainer>
        <IconContainer>
          {props.icon && <Icon path={props.icon} size={1} color={clouds} />}
          {props.avatar && <Avatar name={props.avatar} size={24} />}
        </IconContainer>
        <TextContainer>{props.text}</TextContainer>
      </TitleContainer>
      <CloseButton>
        <Icon path={mdiClose} size={0.8} color={clouds} />
      </CloseButton>
    </Container>
  )
}

const Container = styled.div<ChatNavigationTabProps>`
  display: flex;
  align-items: center;

  ${(props) => (props.active ? activeStyle : inactiveStyle)};
`

const activeStyle = css`
  background-color: ${flist4};
`

const inactiveStyle = css`
  opacity: 0.5;

  &:hover {
    opacity: 0.6;
  }
`

const TitleContainer = styled.a.attrs({ href: "#" })`
  flex-grow: 1;

  padding: 0.6rem 0.6rem;

  display: flex;
  align-items: center;

  white-space: nowrap;
  overflow: hidden;
`

const IconContainer = styled.div`
  padding-right: 0.4rem;

  /* to remove the random spacing on the icon */
  svg,
  img {
    display: block;
  }
`

const TextContainer = styled.div`
  text-overflow: ellipsis;
  flex-grow: 1;
  overflow: hidden;
`

const CloseButton = styled.a.attrs({ href: "#" })`
  padding: 0.3rem 0.4rem;
  flex-shrink: 0;

  /* to remove the random spacing on the icon */
  svg,
  img {
    display: block;
  }
`
