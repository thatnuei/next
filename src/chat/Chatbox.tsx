import css from "@emotion/css"
import React from "react"
import { useRootStore } from "../RootStore"
import useInput from "../state/useInput"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import TextArea from "../ui/TextArea"

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

  return (
    <div css={inputContainerStyle}>
      <TextArea
        placeholder={`Chatting as ${chatStore.identity}...`}
        onKeyDown={handleKeyDown}
        {...messageInput.bind}
      />
      <Button onClick={submit}>Send</Button>
    </div>
  )
}
export default Chatbox

const inputContainerStyle = css`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 0.5rem;
  padding: 0.5rem;
  background-color: ${themeColor};
`
