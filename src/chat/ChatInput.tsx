import React from "react"
import Button from "../dom/Button"
import { input, solidButton } from "../ui/components"
import { block, flex1, flexRow, mr, p, themeBgColor } from "../ui/style"

type Props = { identity: string }

function ChatInput({ identity }: Props) {
  return (
    <div css={[themeBgColor(0), flexRow, p(2)]}>
      <textarea
        css={[input, block, flex1, mr(2)]}
        placeholder={`Chatting as ${identity}...`}
      />
      <Button css={solidButton}>Send</Button>
    </div>
  )
}

export default ChatInput
