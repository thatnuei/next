import { darken } from "polished"
import React from "react"
import { LoginModal } from "../app/LoginModal"
import { SelectCharacterModal } from "../app/SelectCharacterModal"
import { ChannelList } from "../channelList/ChannelList"
import { Chat } from "../chat/Chat"
import { ChatSidebar } from "../chat/ChatSidebar"
import { ConversationUserList } from "../conversation/ConversationUserList"
import { flist5 } from "../ui/colors"
import { Overlay } from "../ui/Overlay"
import { styled } from "../ui/styled"
import { NavigationScreen } from "./NavigationStore"

export const selectCharacterScreen = (): NavigationScreen => ({
  key: "characterSelect",
  render: () => <SelectCharacterModal />,
})

export const loginScreen = (): NavigationScreen => ({
  key: "login",
  render: () => <LoginModal />,
})

export const chatScreen = (): NavigationScreen => ({
  key: "chat",
  render: () => <Chat />,
})

export const chatSidebarKey = "chatSidebar"

export const chatSidebarOverlay = (): NavigationScreen => ({
  key: chatSidebarKey,
  render: ({ close }) => (
    <Overlay anchor="left" onShadeClick={close}>
      <SidebarOverlayContainer>
        <ChatSidebar onTabActivate={close} />
      </SidebarOverlayContainer>
    </Overlay>
  ),
})

const SidebarOverlayContainer = styled.div`
  background-color: ${darken(0.05, flist5)};
  height: 100%;
`

export const channelListOverlay = (): NavigationScreen => ({
  key: "channelList",
  render: ({ close }) => (
    <Overlay onShadeClick={close}>
      <ChannelList />
    </Overlay>
  ),
})

export const userListOverlay = (users: string[]): NavigationScreen => ({
  key: "userList",
  render: ({ close }) => (
    <Overlay anchor="right" onShadeClick={close}>
      {users && <ConversationUserList users={users} />}
    </Overlay>
  ),
})
