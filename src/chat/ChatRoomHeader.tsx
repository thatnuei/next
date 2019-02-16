import React from "react"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import Icon from "../ui/Icon"
import SideOverlay from "../ui/SideOverlay"
import { css } from "../ui/styled"
import useOverlayState from "../ui/useOverlayState"
import ChatSidebarContent from "./ChatSidebarContent"

type ChatRoomHeaderProps = {
  children?: React.ReactNode
}

const ChatRoomHeader = (props: ChatRoomHeaderProps) => {
  const sidebar = useOverlayState()

  return (
    <header css={headerStyle}>
      <Button flat onClick={sidebar.open}>
        <Icon icon="menu" />
      </Button>

      {props.children}

      <SideOverlay {...sidebar.bind}>
        <ChatSidebarContent />
      </SideOverlay>
    </header>
  )
}
export default ChatRoomHeader

export const headerStyle = css`
  display: flex;
  align-items: center;
  background-color: ${themeColor};
  min-height: 50px;
`
