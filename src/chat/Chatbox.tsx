import React from "react"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import Button from "../ui/Button"
import TextArea from "../ui/TextArea"
import { spacing } from "../ui/theme"
import { TypingStatus } from "./types"
import useTypingStatus from "./useTypingStatus"

type Props = {
  value: string
  onValueChange: (value: string) => void
  onSubmit: (message: string) => void
  onSubmitCommand?: (command: string, ...args: string[]) => void
  onTypingStatus?: (status: TypingStatus) => void
}

const Chatbox = (props: Props) => {
  const { chatStore } = useRootStore()

  const trimmedInput = props.value.trim()

  const { onTypingStatus } = props
  useTypingStatus(trimmedInput, onTypingStatus)

  const submit = () => {
    if (props.value.match(/^\/[a-z]+/i)) {
      if (props.onSubmitCommand) {
        const [command, ...args] = props.value.slice(1).split(/\s+/)
        props.onSubmitCommand(command, ...args)
      }
    } else {
      props.onSubmit(trimmedInput)
    }

    props.onValueChange("")
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
      event.preventDefault()
      submit()
    }
  }

  const textAreaStyle: React.CSSProperties = {
    fontStyle: props.value === "" ? "italic" : undefined,
    resize: "none",
  }

  return (
    <Box direction="row" gap={spacing.xsmall}>
      <Box flex>
        <TextArea
          value={props.value}
          onChange={(event) => props.onValueChange(event.target.value)}
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
