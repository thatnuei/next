import React, { useState } from "react"
import Avatar from "../character/Avatar"
import CharacterDetails from "../character/CharacterDetails"
import CharacterName from "../character/CharacterName"
import { Character } from "../character/types"
import { safeIndex } from "../common/safeIndex"
import Button from "../dom/Button"
import { fadedButton, headerText2, input, solidButton } from "../ui/components"
import Icon, { iconSize } from "../ui/Icon"
import {
  block,
  fixedCover,
  flex1,
  flexColumn,
  flexRow,
  fontSize,
  hidden,
  inlineBlock,
  leadingNone,
  mb,
  minH,
  ml,
  mr,
  my,
  opacity,
  p,
  px,
  py,
  screen,
  scrollVertical,
  size,
  themeBgColor,
  w,
} from "../ui/style"
import NavAction from "./NavAction"
import RoomTab from "./RoomTab"

type Props = {
  identity: string
}

const gapSize = "4px"

const testCharacter: Character = {
  name: "Testificate",
  gender: "Male",
  status: "busy",
  statusMessage: "look at this photograph every time i do it makes me laugh",
}

type RoomTabInfo =
  | { type: "channel"; title: string }
  | { type: "private-chat"; partner: Character }

function Chat(props: Props) {
  const { tabs, activeTab, setActiveTab } = useChatRoomTabs()

  const users: Character[] = [
    {
      name: "Testificate",
      gender: "Male",
      status: "online",
      statusMessage:
        "look at this photograph every time i do it makes me laugh",
    },
    {
      name: "Testificate",
      gender: "Female",
      status: "looking",
      statusMessage:
        "look at this photograph every time i do it makes me laugh",
    },
    {
      name: "Testificate",
      gender: "Shemale",
      status: "busy",
      statusMessage:
        "look at this photograph every time i do it makes me laugh",
    },
    {
      name: "Testificate",
      gender: "Transgender",
      status: "away",
      statusMessage:
        "look at this photograph every time i do it makes me laugh",
    },
    {
      name: "Testificate",
      gender: "Cunt-boy",
      status: "dnd",
      statusMessage:
        "look at this photograph every time i do it makes me laugh",
    },
    {
      name: "Testificate",
      gender: "Male-Herm",
      status: "offline",
      statusMessage:
        "look at this photograph every time i do it makes me laugh",
    },
    {
      name: "Testificate",
      gender: "None",
      status: "offline",
      statusMessage:
        "look at this photograph every time i do it makes me laugh",
    },
  ]

  const messages = users.map((sender) => ({
    sender,
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non vehicula metus. Suspendisse sollicitudin lacus tortor, sed ornare ante pretium ut. In accumsan, purus sit amet hendrerit convallis, libero ex porta dolor, ac varius lacus nulla id lacus. In et gravida dui. Nulla nec quam erat. Aliquam nec arcu est. Sed at elit vulputate, convallis libero sit amet, ornare sem. Maecenas condimentum risus ipsum, a malesuada sem auctor sit amet. Pellentesque a vehicula lectus, sed posuere lacus. Quisque id nulla nec magna aliquam mollis. Quisque quis dolor erat.",
    timestamp: Date.now(),
  }))

  function getTabProps(tab: RoomTabInfo) {
    if (tab.type === "channel") {
      return {
        key: `channel:${tab.title}`,
        title: tab.title,
        icon: <Icon name="public" />,
      }
    }

    return {
      key: `private-chat:${tab.partner.name}`,
      title: tab.partner.name,
      icon: <Avatar name={tab.partner.name} css={size(iconSize(3))} />,
    }
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
            <CharacterDetails character={testCharacter} />
          </div>
          <div css={[themeBgColor(1), flex1]}>
            {tabs.map((tab) => (
              <RoomTab
                {...getTabProps(tab)}
                state={activeTab === tab ? "active" : "inactive"}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
        </div>
      </nav>

      <div css={[flex1]}>
        <div css={[size("full"), flexColumn]}>
          <div css={[themeBgColor(0), p(3), flexRow]}>
            <Button css={[fadedButton, mr(3), hidden, screen.small(block)]}>
              <Icon name="menu" />
            </Button>
            <h1 css={[headerText2, leadingNone]}>Frontpage</h1>
            <div css={flex1} />
            <Button
              css={[
                fadedButton,
                ml(3),
                hidden,
                screen.small(block),
                screen.medium(block),
              ]}
            >
              <Icon name="users" />
            </Button>
          </div>

          <div css={[flex1, flexRow, my(gapSize), minH(0)]}>
            <ol css={[flex1, themeBgColor(1), p(2), scrollVertical]}>
              {messages.map((message, i) => (
                <li key={i} css={mb(2)}>
                  <span
                    css={[
                      inlineBlock,
                      opacity(0.5),
                      fontSize("small"),
                      ml(3),
                      { float: "right" },
                    ]}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  <span css={[inlineBlock, mr(2)]}>
                    <CharacterName {...message.sender} />
                  </span>
                  <span>{message.text}</span>
                </li>
              ))}
            </ol>

            <div
              css={[
                ml(gapSize),
                w(60),
                flexColumn,
                screen.small(hidden),
                screen.medium(hidden),
              ]}
            >
              <div css={[themeBgColor(0), px(3), py(2)]}>Characters: 420</div>
              <ul css={[themeBgColor(1), px(3), py(2), flex1, scrollVertical]}>
                {users.map((char, i) => (
                  <li key={i} css={[mb(2)]}>
                    <CharacterName {...char} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div css={[themeBgColor(0), flexRow, p(2)]}>
            <textarea
              css={[input, block, flex1, mr(2)]}
              placeholder={`Chatting as ${testCharacter.name}...`}
            />
            <Button css={solidButton}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat

function useChatRoomTabs() {
  const [tabs] = useState<RoomTabInfo[]>([
    { type: "channel", title: "Frontpage" },
    { type: "channel", title: "Fantasy" },
    { type: "channel", title: "Story Driven LFRP" },
    { type: "channel", title: "Kissaten Treehouse (Slice of Life)" },
    {
      type: "private-chat",
      partner: {
        name: "Subaru-chan",
        gender: "Female",
        status: "online",
        statusMessage: "bleh",
      },
    },
  ])

  const [activeTab = safeIndex(tabs, 0), setActiveTab] = useState<RoomTabInfo>()

  return { tabs, activeTab, setActiveTab }
}
