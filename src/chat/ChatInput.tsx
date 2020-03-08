import React from "react"
import Button from "../dom/Button"
import { input, solidButton } from "../ui/components"
import { block, flex1, flexRow, mr, p, themeBgColor } from "../ui/style"

type Props = { identity: string }

function ChatInput({ identity }: Props) {
  return (
    <div>
      <textarea placeholder={`Chatting as ${identity}...`} />
      <Button>Send</Button>
    </div>
  );
}

export default ChatInput
