import React, { useState } from "react"
import ChannelView from "../channel/ChannelView"
import { Channel, createChannel } from "../channel/types"
import Avatar from "../character/Avatar"
import CharacterDetails from "../character/CharacterDetails"
import { Character } from "../character/types"
import { range } from "../common/range"
import { safeIndex } from "../common/safeIndex"
import Button from "../dom/Button"
import { Message } from "../message/types"
import PrivateChatView from "../privateChat/PrivateChatView"
import {
  fadedButton,
  headerText,
  input,
  raisedPanel,
  raisedPanelHeader,
  solidButton,
} from "../ui/components"
import Icon, { iconSize } from "../ui/Icon"
import {
  alignItems,
  block,
  fixedCover,
  flex1,
  flexCenter,
  flexColumn,
  flexRow,
  h,
  hidden,
  hover,
  maxH,
  maxW,
  mb,
  ml,
  mr,
  opacity,
  p,
  px,
  py,
  scrollVertical,
  semiBlackBg,
  size,
  smallScreen,
  textRight,
  themeBgColor,
  transition,
  w,
} from "../ui/style"
import ChatInput from "./ChatInput"
import NavAction from "./NavAction"
import RoomTab from "./RoomTab"
import {
  ChatState,
  getChannel,
  getCharacter,
  getCharactersFromNames,
  getFullMessages,
  getPrivateChat,
} from "./types"

type Props = {
  identity: string
}

export const gapSize = "6px"

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
    <Button
      title="Show side menu"
      css={[fadedButton, mr(3), hidden, smallScreen(block)]}
    >
      <Icon name="menu" />
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
    <>
      <div css={[fixedCover, flexRow]}>
        <nav css={[flexRow, mr(gapSize), smallScreen(hidden)]}>
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

      <div css={[fixedCover, semiBlackBg(0.75), flexColumn, flexCenter, p(6)]}>
        <div
          css={[
            raisedPanel,
            w("full"),
            maxW(120),
            h("full"),
            maxH(180),
            flexColumn,
          ]}
        >
          <div css={[raisedPanelHeader]}>
            <h1 css={[headerText]}>hi</h1>
          </div>
          <div css={[flex1, flexColumn, scrollVertical, themeBgColor(2)]}>
            {range(100).map((i) => (
              <button
                css={[
                  py(2),
                  px(2),
                  flexRow,
                  alignItems("center"),
                  i % 10 === 0
                    ? [opacity(1), themeBgColor(0)]
                    : [opacity(0.4), hover(opacity(0.7))],
                  transition("opacity"),
                ]}
              >
                <Icon name="public" css={[mr(2), { flexShrink: 0 }]} />
                <div>
                  really really really really really really really really really
                  really really really long room name {i}
                </div>
                <div css={[flex1]} />
                <div css={[w(18), textRight]}>
                  {Math.floor(Math.random() * 1000)}
                </div>
              </button>
            ))}
          </div>

          <div css={[flexRow, p(2)]}>
            <input type="text" placeholder="Search..." css={[input, flex1]} />
            <Button css={[solidButton, ml(2)]}>
              <Icon name="sortAlphabetical" />
            </Button>
            <Button css={[solidButton, ml(2)]}>
              <Icon name="refresh" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chat

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
  key: String(Math.random()),
  senderName: sender.name,
  text:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non vehicula metus. Suspendisse sollicitudin lacus tortor, sed ornare ante pretium ut. In accumsan, purus sit amet hendrerit convallis, libero ex porta dolor, ac varius lacus nulla id lacus. In et gravida dui. Nulla nec quam erat. Aliquam nec arcu est. Sed at elit vulputate, convallis libero sit amet, ornare sem. Maecenas condimentum risus ipsum, a malesuada sem auctor sit amet. Pellentesque a vehicula lectus, sed posuere lacus. Quisque id nulla nec magna aliquam mollis. Quisque quis dolor erat.",
  timestamp: Date.now(),
  type: "normal",
}))

messages[0].type = "lfrp"
messages[1].type = "admin"
messages[2].type = "system"

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
