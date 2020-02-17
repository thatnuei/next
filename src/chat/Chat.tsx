import React, { useState } from "react"
import ChannelView from "../channel/ChannelView"
import { Channel, createChannel } from "../channel/types"
import Avatar from "../character/Avatar"
import CharacterDetails from "../character/CharacterDetails"
import { Character } from "../character/types"
import { isPresent } from "../common/isPresent"
import { safeIndex } from "../common/safeIndex"
import Button from "../dom/Button"
import { Message } from "../message/types"
import PrivateChatView from "../privateChat/PrivateChatView"
import { fadedButton } from "../ui/components"
import Icon, { iconSize } from "../ui/Icon"
import {
  block,
  fixedCover,
  flex1,
  flexColumn,
  flexRow,
  hidden,
  mb,
  mr,
  p,
  py,
  screen,
  scrollVertical,
  size,
  themeBgColor,
  w,
} from "../ui/style"
import ChatInput from "./ChatInput"
import NavAction from "./NavAction"
import RoomTab from "./RoomTab"
import { ChatState, getChannel, getCharacter, getPrivateChat } from "./types"

type Props = {
  identity: string
}

export const gapSize = "6px"

const testificate: Character = {
  name: "Testificate",
  gender: "Male",
  status: "busy",
  statusMessage: "look at this photograph every time i do it makes me laugh",
}

const subaru: Character = {
  name: "Subaru-chan",
  gender: "Female",
  status: "online",
  statusMessage: "h",
}

type RoomTabInfo =
  | { type: "channel"; channelId: string }
  | { type: "private-chat"; partnerName: string }

const users: Character[] = [
  {
    name: "Testificate",
    gender: "Male",
    status: "online",
    statusMessage: "look at this photograph every time i do it makes me laugh",
  },
  {
    name: "Testificate",
    gender: "Female",
    status: "looking",
    statusMessage: "look at this photograph every time i do it makes me laugh",
  },
  {
    name: "Testificate",
    gender: "Shemale",
    status: "busy",
    statusMessage: "look at this photograph every time i do it makes me laugh",
  },
  {
    name: "Testificate",
    gender: "Transgender",
    status: "away",
    statusMessage: "look at this photograph every time i do it makes me laugh",
  },
  {
    name: "Testificate",
    gender: "Cunt-boy",
    status: "dnd",
    statusMessage: "look at this photograph every time i do it makes me laugh",
  },
  {
    name: "Testificate",
    gender: "Male-Herm",
    status: "offline",
    statusMessage: "look at this photograph every time i do it makes me laugh",
  },
  {
    name: "Testificate",
    gender: "None",
    status: "offline",
    statusMessage: "look at this photograph every time i do it makes me laugh",
  },
]

const messages = users.map<Message>((sender) => ({
  sender,
  text:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non vehicula metus. Suspendisse sollicitudin lacus tortor, sed ornare ante pretium ut. In accumsan, purus sit amet hendrerit convallis, libero ex porta dolor, ac varius lacus nulla id lacus. In et gravida dui. Nulla nec quam erat. Aliquam nec arcu est. Sed at elit vulputate, convallis libero sit amet, ornare sem. Maecenas condimentum risus ipsum, a malesuada sem auctor sit amet. Pellentesque a vehicula lectus, sed posuere lacus. Quisque id nulla nec magna aliquam mollis. Quisque quis dolor erat.",
  timestamp: Date.now(),
}))

function createMockChannel(id: string, title = id): Channel {
  return {
    ...createChannel(id),
    title,
    messages,
    users: ["Subaru-chan", "Testificate"],
  }
}

const chatState: ChatState = {
  characters: {
    "Subaru-chan": subaru,
    "Testificate": testificate,
  },
  channels: {
    "Frontpage": createMockChannel("Frontpage"),
    "Fantasy": createMockChannel("Fantasy"),
    "Story Driven LFRP": createMockChannel("Story Driven LFRP"),
    "aiolofasjdf;asdmfoidfa;miosd;afanio;": createMockChannel(
      "aiolofasjdf;asdmfoidfa;miosd;afanio;",
      "Kissaten Treehouse (Slice of Life)",
    ),
  },
  privateChats: {},
}

function getTabProps(tab: RoomTabInfo, chatState: ChatState) {
  if (tab.type === "channel") {
    const channel = chatState.channels[tab.channelId]
    return {
      key: `channel:${tab.channelId}`,
      title: channel?.title ?? tab.channelId,
      icon: <Icon name="public" />,
    }
  }

  return {
    key: `private-chat:${tab.partnerName}`,
    title: tab.partnerName,
    icon: <Avatar name={tab.partnerName} css={size(iconSize(3))} />,
  }
}

function Chat(props: Props) {
  const [tabs] = useState<RoomTabInfo[]>([
    { type: "channel", channelId: "Frontpage" },
    { type: "channel", channelId: "Fantasy" },
    { type: "channel", channelId: "Story Driven LFRP" },
    { type: "channel", channelId: "aiolofasjdf;asdmfoidfa;miosd;afanio;" },
    { type: "private-chat", partnerName: subaru.name },
  ])

  const [activeTab = safeIndex(tabs, 0), setActiveTab] = useState<RoomTabInfo>()

  const menuButton = (
    <Button css={[fadedButton, mr(3), hidden, screen.small(block)]}>
      <Icon name="menu" />
    </Button>
  )

  function renderChannel(id: string) {
    const channel = getChannel(chatState, id)
    return (
      <ChannelView
        title={channel.title}
        messages={channel.messages}
        users={channel.users
          .map((name) => getCharacter(chatState, name))
          .filter(isPresent)}
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
        messages={chat.messages}
        menuButton={menuButton}
        chatInput={<ChatInput identity={props.identity} />}
      />
    )
  }

  return (
    <div css={[fixedCover, flexRow]}>
      <nav css={[flexRow, mr(gapSize), screen.small(hidden)]}>
        <div css={[flexColumn, py(2)]}>
          <NavAction icon="channels" title="Browse channels" />
          <NavAction icon="updateStatus" title="Update your status" />
          <NavAction icon="users" title="See online friends and bookmarks" />
          <NavAction icon="about" title="About next" />
          <div css={flex1} />
          <NavAction icon="logout" title="Log out" />
        </div>

        <div css={[flexColumn, w(54), scrollVertical]}>
          <div css={[themeBgColor(0), mb(gapSize), p(3)]}>
            <CharacterDetails character={testificate} />
          </div>
          <div css={[themeBgColor(1), flex1]}>
            {tabs.map((tab) => (
              <RoomTab
                {...getTabProps(tab, chatState)}
                state={activeTab === tab ? "active" : "inactive"}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
        </div>
      </nav>

      <div css={[flex1]}>
        {activeTab?.type === "channel" && renderChannel(activeTab.channelId)}
        {activeTab?.type === "private-chat" &&
          renderPrivateChat(activeTab.partnerName)}
      </div>
    </div>
  )
}

export default Chat
