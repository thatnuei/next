import { observer } from "mobx-react-lite"
import React from "react"
import Button from "../../ui/components/Button"
import TextArea from "../../ui/components/TextArea"
import { flexRow, spacedChildrenHorizontal } from "../../ui/helpers"
import { styled } from "../../ui/styled"
import { getThemeColor, spacing } from "../../ui/theme"
import useRootStore from "../../useRootStore"
import { TypingStatus } from "../types"
import useTypingStatus from "../useTypingStatus"

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
    <Container>
      <StyledTextArea
        value={props.value}
        onChange={(event) => props.onValueChange(event.target.value)}
        placeholder={`Chatting as ${chatStore.identity}...`}
        onKeyDown={handleKeyDown}
        style={textAreaStyle}
      />
      <Button onClick={submit}>Send</Button>
    </Container>
  )
}

export default observer(Chatbox)

const Container = styled.div`
  background-color: ${getThemeColor("theme0")};
  ${flexRow};
  padding: ${spacing.xsmall};
  ${spacedChildrenHorizontal(spacing.xsmall)};
`

const StyledTextArea = styled(TextArea)`
  flex: 1;
  resize: none;
`
