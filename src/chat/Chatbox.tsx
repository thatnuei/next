import React from "react"
import { TypingStatus } from "../private-chat/types"
import { buttonSolid, input } from "../ui/components"
import { bgMidnight, flex, flex1, mr, p } from "../ui/helpers.new"
import useTypingStatus from "./useTypingStatus"

type Props = {
  value: string
  placeholder?: string
  onValueChange: (value: string) => void
  onSubmit: (message: string) => void
  onSubmitCommand?: (command: string, ...args: string[]) => void
  onTypingStatus?: (status: TypingStatus) => void
}

function Chatbox(props: Props) {
  const trimmedInput = props.value.trim()

  const { onTypingStatus } = props
  useTypingStatus(trimmedInput, onTypingStatus)

  const handleSubmit = () => {
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
      handleSubmit()
    }
  }

  const textAreaStyle: React.CSSProperties = {
    fontStyle: props.value === "" ? "italic" : undefined,
    resize: "none",
  }

  return (
    <form onSubmit={handleSubmit} css={[bgMidnight(700), flex("row"), p(2)]}>
      <textarea
        css={[input, flex1, { resize: "none" }, mr(2)]}
        value={props.value}
        onChange={(event) => props.onValueChange(event.target.value)}
        placeholder={props.placeholder}
        onKeyDown={handleKeyDown}
        style={textAreaStyle}
      />
      <button type="submit" css={buttonSolid}>
        Send
      </button>
    </form>
  )
}

export default Chatbox
