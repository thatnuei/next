import React from "react"
import { useRootStore } from "../RootStore"
import useInput from "../state/useInput"
import Box from "../ui/Box"
import Button from "../ui/Button"
import TextArea from "../ui/TextArea"
import { gapSizes } from "../ui/theme"

type Props = {
  onSubmit: (message: string) => void
}

const Chatbox = (props: Props) => {
  const { chatStore } = useRootStore()
  const messageInput = useInput()

  const submit = () => {
    props.onSubmit(messageInput.value)
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
    <Box direction="row" gap={gapSizes.xsmall}>
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
