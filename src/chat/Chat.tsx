import React, { useState } from "react"
import ChannelBrowser from "../channel/ChannelBrowser"
import ChannelView from "../channel/ChannelView"
import { safeIndex } from "../common/safeIndex"
import Button from "../dom/Button"
import PrivateChatView from "../privateChat/PrivateChatView"
import { fadedButton } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import {
  block,
  fixedCover,
  flex1,
  flexColumn,
  flexRow,
  hidden,
  mr,
  smallScreen,
  w,
} from "../ui/style"
import ChatHome from "./ChatHome"
import ChatInput from "./ChatInput"
import { chatState, subaru } from "./mockData"
import NavAction from "./NavAction"
import {
  getChannel,
  getCharacter,
  getCharactersFromNames,
  getFullMessages,
  getPrivateChat,
} from "./types"

type Props = {
  identity: string
}

type ChatView =
  | { name: "home" }
  | { name: "channel-browser" }
  | { name: "update-status" }
  | { name: "online-users" }
  | { name: "about" }

export type RoomView =
  | { name: "channel"; channelId: string }
  | { name: "private-chat"; partnerName: string }

export const gapSize = "6px"

function Chat(props: Props) {
  const [chatView, setChatView] = useState<ChatView>({ name: "home" })

  const rooms: RoomView[] = [
    { name: "channel", channelId: "Frontpage" },
    { name: "channel", channelId: "Fantasy" },
    { name: "channel", channelId: "Story Driven LFRP" },
    { name: "channel", channelId: "aiolofasjdf;asdmfoidfa;miosd;afanio;" },
    { name: "private-chat", partnerName: subaru.name },
  ]

  const [activeRoom = safeIndex(rooms, 0), setActiveRoom] = useState<RoomView>()

  const menuButton = (
    <Button
      title="Show side menu"
      css={[fadedButton, mr(3), hidden, smallScreen(block)]}
    >
      <Icon which={icons.menu} />
    </Button>
  )

  function renderChannel(id: string) {
    const channel = getChannel(chatState, id)
    return (
      <ChannelView
        title={channel.title}
        messages={getFullMessages(chatState, channel.messages)}
        users={getCharactersFromNames(chatState, channel.users)}
        chatInput={<ChatInput identity={props.identity} />}
        menuButton={menuButton}
      />
    )
  }

  function renderPrivateChat(partnerName: string) {
    const chat = getPrivateChat(chatState, partnerName)
    return (
      <PrivateChatView
        partner={getCharacter(chatState, partnerName)}
        messages={getFullMessages(chatState, chat.messages)}
        menuButton={menuButton}
        chatInput={<ChatInput identity={props.identity} />}
      />
    )
  }

  return (
    <div css={[fixedCover, flexRow]}>
      <nav css={[flexRow, mr(gapSize), smallScreen(hidden)]}>
        <div css={[flexColumn, mr(gapSize)]}>
          <NavAction
            icon={icons.home}
            title="Home"
            isActive={chatView.name === "home"}
            onClick={() => setChatView({ name: "home" })}
          />
          <NavAction
            icon={icons.channels}
            title="Browse channels"
            isActive={chatView.name === "channel-browser"}
            onClick={() => setChatView({ name: "channel-browser" })}
          />
          <NavAction icon={icons.updateStatus} title="Update your status" />
          <NavAction
            icon={icons.users}
            title="See online friends and bookmarks"
          />
          <NavAction icon={icons.about} title="About next" />
          <div css={flex1} />
          <NavAction icon={icons.logout} title="Log out" />
        </div>

        {chatView.name === "home" && (
          <div css={w(56)}>
            <ChatHome
              rooms={rooms}
              activeRoom={activeRoom}
              onRoomChange={setActiveRoom}
            />
          </div>
        )}

        {chatView.name === "channel-browser" && (
          <div css={w(80)}>
            <ChannelBrowser />
          </div>
        )}
      </nav>

      <div css={[flex1]}>
        {activeRoom?.name === "channel" && renderChannel(activeRoom.channelId)}
        {activeRoom?.name === "private-chat" &&
          renderPrivateChat(activeRoom.partnerName)}
      </div>
    </div>
  )
}

export default Chat
