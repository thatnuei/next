import React, { useEffect, useState } from "react"
import tw from "twin.macro"
import ChannelBrowser from "../channel/ChannelBrowser"
import ChannelView from "../channel/ChannelView"
import { safeIndex } from "../common/safeIndex"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import PrivateChatView from "../privateChat/PrivateChatView"
import { fadedButton } from "../ui/components"
import { fixedCover } from "../ui/helpers"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import Modal from "../ui/Modal"
import { screenQueries } from "../ui/screens"
import ChatHome from "./ChatHome"
import ChatInput from "./ChatInput"
import {
  getChannel,
  getCharacter,
  getCharactersFromNames,
  getFullMessages,
  getPrivateChat,
} from "./state"
import { chatState, subaru } from "./mockData"
import NavAction from "./NavAction"
import { useSocket } from "./socket"
import UpdateStatus from "./UpdateStatus"

type Props = {
  account: string
  ticket: string
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

function Chat({ account, ticket, identity }: Props) {
  const [, socketActions] = useSocket((command) => {
    console.log(command)
  })

  useEffect(() => {
    socketActions.connect({ account, ticket, identity })
    return () => socketActions.disconnect()
  }, [socketActions, account, ticket, identity])

  const [activeRoom = safeIndex(rooms, 0), setActiveRoom] = useState<RoomView>()
  const [channelBrowserVisible, setChannelBrowserVisible] = useState(false)
  const [updateStatusVisible, setUpdateStatusVisible] = useState(false)

  const isSmallScreen = useMediaQuery(screenQueries.small)

  const menuButton = isSmallScreen && (
    <Button title="Show side menu" css={[fadedButton, tw`mr-3`]}>
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
        chatInput={<ChatInput identity={identity} />}
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
        chatInput={<ChatInput identity={identity} />}
      />
    )
  }

  return (
    <div css={[fixedCover, tw`flex`]}>
      {!isSmallScreen && (
        <nav css={tw`flex mr-gap`}>
          <div css={tw`flex flex-col mr-gap`}>
            <NavAction
              icon={icons.list}
              title="Browse channels"
              onClick={() => setChannelBrowserVisible(true)}
            />
            <NavAction
              icon={icons.updateStatus}
              title="Update your status"
              onClick={() => setUpdateStatusVisible(true)}
            />
            <NavAction
              icon={icons.users}
              title="See online friends and bookmarks"
            />
            <NavAction icon={icons.about} title="About next" />
            <div css={tw`flex-1`} />
            <NavAction icon={icons.logout} title="Log out" />
          </div>

          <div css={tw`w-56`}>
            <ChatHome
              rooms={rooms}
              activeRoom={activeRoom}
              onRoomChange={setActiveRoom}
            />
          </div>
        </nav>
      )}

      <div css={tw`flex-1`}>
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

      <Modal
        title="Update Your Status"
        width={120}
        height={90}
        isVisible={updateStatusVisible}
        onClose={() => setUpdateStatusVisible(false)}
        children={
          <UpdateStatus
            initialValues={{ status: "online", statusMessage: "" }}
            onSubmit={(values) => {
              console.log(values)
              setUpdateStatusVisible(false)
            }}
          />
        }
      />
    </div>
  )
}

export default Chat
