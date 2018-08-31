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
    <Anchor {...props}>
      <IconContainer>
        {props.icon && <Icon path={props.icon} size={1} color={clouds} />}
        {props.avatar && <Avatar name={props.avatar} size={24} />}
      </IconContainer>
      <div>{props.text}</div>
    </Anchor>
  )
}

const IconContainer = styled.div`
  padding-right: 0.4rem;

  /* to remove the random spacing on the icon */
  svg,
  img {
    display: block;
  }
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

const Anchor = styled.a.attrs({ href: "#" })<ChatNavigationTabProps>`
  padding: 0.6rem 0.6rem;

  display: flex;
  align-items: center;

  ${(props) => (props.active ? activeStyle : inactiveStyle)};
`
