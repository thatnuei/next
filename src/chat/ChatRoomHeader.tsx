import React from "react"
import { themeColor } from "../ui/colors"
import FlatButton from "../ui/FlatButton"
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
    <>
      <header css={headerStyle}>
        <FlatButton onClick={sidebar.open}>
          <Icon icon="menu" />
        </FlatButton>
        <div>{props.children}</div>
      </header>

      <SideOverlay {...sidebar.bind}>
        <ChatSidebarContent />
      </SideOverlay>
    </>
  )
}
export default ChatRoomHeader

export const headerStyle = css`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0.5rem;
  background-color: ${themeColor};
  min-height: 50px;
`
