import React from "react"
import CharacterDetails from "../character/CharacterDetails"
import { Character } from "../character/types"
import {
  fixedCover,
  flex1,
  flexBasis,
  flexColumn,
  flexRow,
  mb,
  ml,
  p,
  py,
  themeBgColor,
} from "../ui/style"
import NavAction from "./NavAction"

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

      <div css={[flexColumn, flexBasis(54)]}>
        <div css={[themeBgColor(0), mb(dividerSize), p(3)]}>
          <CharacterDetails character={testCharacter} />
        </div>
        <nav css={[themeBgColor(1), flex1]}>room tabs</nav>
      </div>

      <div css={[ml(dividerSize), flex1]}>room view</div>
    </div>
  )
}

export default Chat
