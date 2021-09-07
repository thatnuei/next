import type { FormEvent, KeyboardEvent, ReactNode } from "react"
import BBCTextArea from "../bbc/BBCInput"
import Button from "../dom/Button"
import type { InputState } from "../state/input"
import { getInputStateValue, setInputStateValue } from "../state/input"
import { solidButton } from "../ui/components"
import { useChatContext } from "./ChatContext"

type Props = {
  maxLength?: number
  inputState: InputState
  renderPreview: (value: string) => ReactNode
  onInputStateChange: (state: InputState) => void
  onSubmit: (text: string) => void
}

export default function ChatInput(props: Props) {
  const { identity, notificationStore } = useChatContext()

  const value = getInputStateValue(props.inputState)
  const valueTrimmed = value.trim()

  function submit() {
    const maxLength = props.maxLength ?? Infinity
    if (valueTrimmed.length <= maxLength) {
      props.onSubmit(valueTrimmed)
      props.onInputStateChange(setInputStateValue(props.inputState, ""))
    } else {
      notificationStore.addToast({
        duration: 7000,
        details: {
          type: "error",
          message: `Your message is too long! Shorten it to ${maxLength} characters or less.`,
        },
      })
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
      event.preventDefault()
      submit()
    }
  }

  function handleFormSubmit(event: FormEvent) {
    event.preventDefault()
    submit()
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className={`flex flex-row p-2 bg-midnight-0`}
    >
      <div className="flex-1 block mr-2">
        <BBCTextArea
          placeholder={`Chatting as ${identity || ""}...`}
          inputState={props.inputState}
          onInputStateChange={props.onInputStateChange}
          maxLength={props.maxLength}
          onKeyDown={handleKeyDown}
          renderPreview={props.renderPreview}
        />
      </div>
      <Button type="submit" className={solidButton}>
        Send
      </Button>
    </form>
  )
}
