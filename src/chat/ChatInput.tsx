import React from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { input, solidButton } from "../ui/components"
import { useChatCredentials } from "./helpers"

type Props = {
  value: string
  onChangeText: (value: string) => void
  onSubmit: (text: string) => void
}

function ChatInput(props: Props) {
  const { identity } = useChatCredentials()

  function submit() {
    props.onSubmit(props.value)
    props.onChangeText("")
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
      event.preventDefault()
      submit()
    }
  }

  function handleFormSubmit(event: React.FormEvent) {
    event.preventDefault()
    submit()
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      css={tw`flex flex-row p-2 bg-background-0`}
    >
      <textarea
        placeholder={`Chatting as ${identity}...`}
        value={props.value}
        onChange={(event) => props.onChangeText(event.target.value)}
        onKeyDown={handleKeyDown}
        css={[input, tw`flex-1 block mr-2`]}
      />
      <Button type="submit" css={solidButton}>
        Send
      </Button>
    </form>
  )
}

export default ChatInput
