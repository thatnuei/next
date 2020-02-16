import React, { useState } from "react"
import Avatar from "../character/Avatar"
import CharacterDetails from "../character/CharacterDetails"
import { Character } from "../character/types"
import { safeIndex } from "../common/safeIndex"
import Icon, { iconSize } from "../ui/Icon"
import {
  fixedCover,
  flex1,
  flexColumn,
  flexRow,
  mb,
  ml,
  p,
  py,
  size,
  themeBgColor,
  w,
} from "../ui/style"
import NavAction from "./NavAction"
import RoomTab from "./RoomTab"

type Props = {
  identity: string
}

const dividerSize = "6px"

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

  return (
    <div css={[fixedCover, flexRow]}>
      <nav css={[flexColumn, py(2)]}>
        <NavAction icon="channels" title="Browse channels" />
        <NavAction icon="updateStatus" title="Update your status" />
        <NavAction icon="users" title="See online friends and bookmarks" />
        <NavAction icon="about" title="About next" />
        <div css={flex1} />
        <NavAction icon="logout" title="Log out" />
      </nav>

      <div css={[flexColumn, w(54)]}>
        <div css={[themeBgColor(0), mb(dividerSize), p(3)]}>
          <CharacterDetails character={testCharacter} />
        </div>
        <nav css={[themeBgColor(2), flex1]}>
          {tabs.map((tab) => (
            <RoomTab
              title={tab.type === "channel" ? tab.title : tab.partner.name}
              icon={
                tab.type === "channel" ? (
                  <Icon name="public" />
                ) : (
                  <Avatar name={tab.partner.name} css={size(iconSize(3))} />
                )
              }
              state={activeTab === tab ? "active" : "inactive"}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </nav>
      </div>

      <div css={[ml(dividerSize), flex1]}>room view</div>
    </div>
  )
}

export default Chat
