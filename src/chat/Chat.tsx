import React from "react"
import {
  fixedCover,
  flex1,
  flexBasis,
  flexColumn,
  flexRow,
  mb,
  ml,
  themeBgColor,
} from "../ui/style"

type Props = {
  identity: string
}

const dividerSize = "6px"

function Chat(props: Props) {
  return (
    <div css={[fixedCover, flexRow]}>
      <nav>actions</nav>
      <aside css={[flexColumn, flexBasis(50)]}>
        <header css={[themeBgColor(0), mb(dividerSize)]}>character info</header>
        <nav css={[themeBgColor(1), flex1]}>room tabs</nav>
      </aside>
      <div css={[ml(dividerSize)]}>room view</div>
    </div>
  )
}

export default Chat
