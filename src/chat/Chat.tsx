import React, { useEffect, useState } from "react"
import tw from "twin.macro"
import ChannelBrowser from "../channel/ChannelBrowser"
import ChannelView from "../channel/ChannelView"
import Avatar from "../character/Avatar"
import CharacterDetails from "../character/CharacterDetails"
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
import ChatInput from "./ChatInput"
import { chatState, subaru, testificate } from "./mockData"
import NavAction from "./NavAction"
import RoomTab from "./RoomTab"
import { useSocket } from "./socket"
import {
  ChatState,
  getChannel,
  getCharacter,
  getCharactersFromNames,
  getFullMessages,
  getPrivateChat,
} from "./state"
import UpdateStatus from "./UpdateStatus"

type Props = {
  account: string
  ticket: string
  identity: string
}

export type RoomView =
  | { name: "channel"; channelId: string }
  | { name: "private-chat"; partnerName: string }

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

          <div css={tw`flex flex-col w-56`}>
            <CharacterDetails
              character={testificate}
              css={tw`p-3 bg-background-0 mb-gap`}
            />
            <div css={tw`flex-1 bg-background-1`}>
              {rooms.map((room) => (
                <RoomTab
                  {...getRoomProps(room, chatState)}
                  state={activeRoom === room ? "active" : "inactive"}
                  onClick={() => setActiveRoom(room)}
                />
              ))}
            </div>
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
        width={480}
        height={720}
        isVisible={channelBrowserVisible}
        onClose={() => setChannelBrowserVisible(false)}
        children={<ChannelBrowser />}
      />

      <Modal
        title="Update Your Status"
        width={480}
        height={360}
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

function getRoomProps(room: RoomView, chatState: ChatState) {
  const iconSizeStyle = tw`w-5 h-5`

  if (room.name === "channel") {
    const channel = chatState.channels[room.channelId]
    return {
      key: `channel:${room.channelId}`,
      title: channel?.title ?? room.channelId,
      icon: <Icon which={icons.earth} css={iconSizeStyle} />,
    }
  }

  return {
    key: `private-chat:${room.partnerName}`,
    title: room.partnerName,
    icon: <Avatar name={room.partnerName} css={iconSizeStyle} />,
  }
}
