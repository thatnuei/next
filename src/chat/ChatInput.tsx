import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { input, solidButton } from "../ui/components"
import { useChatContext } from "./context"

type Props = {}

function ChatInput(props: Props) {
  const { identity } = useChatContext()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} css={tw`flex flex-row p-2 bg-background-0`}>
      <textarea
        placeholder={`Chatting as ${identity}...`}
        css={[input, tw`flex-1 block mr-2`]}
      />
      <Button type="submit" css={solidButton}>
        Send
      </Button>
    </form>
  )
}

export default observer(ChatInput)
