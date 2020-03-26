import React from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { input, solidButton } from "../ui/components"

type Props = { identity: string }

function ChatInput({ identity }: Props) {
  return (
    <div css={tw`bg-background-0 flex flex-row p-2`}>
      <textarea
        css={[input, tw`block flex-1 mr-2`]}
        placeholder={`Chatting as ${identity}...`}
      />
      <Button css={solidButton}>Send</Button>
    </div>
  )
}

export default ChatInput
