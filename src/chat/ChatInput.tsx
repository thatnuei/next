import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { InputState } from "../form/InputState"
import TextArea from "../form/TextArea"
import { input, solidButton } from "../ui/components"
import { useChatCredentials } from "./credentialsContext"

type Props = {
  inputModel: InputState<string>
  onSubmit: (text: string) => void
}

function ChatInput(props: Props) {
  const { identity } = useChatCredentials()

  function submit() {
    props.onSubmit(props.inputModel.value)
    props.inputModel.reset()
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
      <TextArea
        state={props.inputModel}
        placeholder={`Chatting as ${identity}...`}
        css={[input, tw`flex-1 block mr-2`]}
        onKeyDown={handleKeyDown}
      />
      <Button type="submit" css={solidButton}>
        Send
      </Button>
    </form>
  )
}

export default observer(ChatInput)
