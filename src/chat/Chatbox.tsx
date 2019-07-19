import React from "react"
import { useRootStore } from "../RootStore"
import useInput from "../state/useInput"
import Box from "../ui/Box"
import Button from "../ui/Button"
import TextArea from "../ui/TextArea"
import { spacing } from "../ui/theme"
import { TypingStatus } from "./types"
import useTypingStatus from "./useTypingStatus"

type Props = {
  onSubmit: (message: string) => void
  onSubmitCommand?: (command: string, ...args: string[]) => void
  onTypingStatus?: (status: TypingStatus) => void
}

const Chatbox = (props: Props) => {
  const { chatStore } = useRootStore()

  const messageInput = useInput()
  const trimmedInput = messageInput.value.trim()

  const { onTypingStatus } = props
  useTypingStatus(trimmedInput, onTypingStatus)

  const submit = () => {
    if (trimmedInput.startsWith("/")) {
      if (props.onSubmitCommand) {
        const [command, ...args] = trimmedInput.slice(1).split(/\s+/)
        props.onSubmitCommand(command, ...args)
      }
    } else {
      props.onSubmit(trimmedInput)
    }

    messageInput.setValue("")
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
      event.preventDefault()
      submit()
    }
  }

  const textAreaStyle: React.CSSProperties = {
    fontStyle: messageInput.value === "" ? "italic" : undefined,
    resize: "none",
  }

  return (
    <Box direction="row" gap={spacing.xsmall}>
      <Box flex>
        <TextArea
          {...messageInput.bind}
          placeholder={`Chatting as ${chatStore.identity}...`}
          onKeyDown={handleKeyDown}
          style={textAreaStyle}
        />
      </Box>
      <Button onClick={submit}>Send</Button>
    </Box>
  )
}
export default Chatbox
