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
  themeBgColor,
} from "../ui/style"

type Props = {
  identity: string
}

const dividerSize = "6px"

const testCharacter: Character = {
  name: "Testificate",
  gender: "None",
  status: "online",
  statusMessage: "look at this photograph every time i do it makes me laugh",
}

function Chat(props: Props) {
  return (
    <div css={[fixedCover, flexRow]}>
      <nav>actions</nav>
      <aside css={[flexColumn, flexBasis(50)]}>
        <header css={[themeBgColor(0), mb(dividerSize), p(3)]}>
          <CharacterDetails character={testCharacter}></CharacterDetails>
        </header>
        <nav css={[themeBgColor(1), flex1]}>room tabs</nav>
      </aside>
      <div css={[ml(dividerSize)]}>room view</div>
    </div>
  )
}

export default Chat
