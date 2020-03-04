import React, { useState } from "react"
import ChannelBrowser from "../channel/ChannelBrowser"
import ChannelView from "../channel/ChannelView"
import { safeIndex } from "../common/safeIndex"
import Button from "../dom/Button"
import PrivateChatView from "../privateChat/PrivateChatView"
import { fadedButton } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import Modal from "../ui/Modal"
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

export type RoomView =
  | { name: "channel"; channelId: string }
  | { name: "private-chat"; partnerName: string }

export const gapSize = "6px"

const rooms: RoomView[] = [
  { name: "channel", channelId: "Frontpage" },
  { name: "channel", channelId: "Fantasy" },
  { name: "channel", channelId: "Story Driven LFRP" },
  { name: "channel", channelId: "aiolofasjdf;asdmfoidfa;miosd;afanio;" },
  { name: "private-chat", partnerName: subaru.name },
]

function Chat(props: Props) {
  const [activeRoom = safeIndex(rooms, 0), setActiveRoom] = useState<RoomView>()
  const [channelBrowserVisible, setChannelBrowserVisible] = useState(false)

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
            icon={icons.list}
            title="Browse channels"
            onClick={() => setChannelBrowserVisible(true)}
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

        <div css={w(56)}>
          <ChatHome
            rooms={rooms}
            activeRoom={activeRoom}
            onRoomChange={setActiveRoom}
          />
        </div>
      </nav>

      <div css={[flex1]}>
        {activeRoom?.name === "channel" && renderChannel(activeRoom.channelId)}
        {activeRoom?.name === "private-chat" &&
          renderPrivateChat(activeRoom.partnerName)}
      </div>

      <Modal
        title="Channels"
        width={120}
        height={180}
        isVisible={channelBrowserVisible}
        onClose={() => setChannelBrowserVisible(false)}
        children={<ChannelBrowser />}
      />
    </div>
  )
}

export default Chat
