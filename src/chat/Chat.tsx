import React from "react"
import Avatar from "../character/Avatar"
import CharacterDetails from "../character/CharacterDetails"
import { Character } from "../character/types"
import Icon from "../ui/Icon"
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

function Chat(props: Props) {
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
          <RoomTab
            title="Frontpage"
            icon={<Icon name="public" />}
            state="active"
          />
          <RoomTab
            title="Fantasy"
            icon={<Icon name="public" />}
            state="inactive"
          />
          <RoomTab
            title="Story Driven LFRP"
            icon={<Icon name="public" />}
            state="inactive"
          />
          <RoomTab
            title="Kissaten Treehouse (Slice of Life)"
            icon={<Icon name="private" />}
            state="unread"
          />
          <RoomTab
            title="Subaru-chan"
            icon={<Avatar name="Subaru-chan" css={[size(6)]} />}
            state="inactive"
          />
        </nav>
      </div>

      <div css={[ml(dividerSize), flex1]}>room view</div>
    </div>
  )
}

export default Chat
