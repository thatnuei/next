import type { FormEvent, KeyboardEvent } from "react"
import { useRef } from "react"
import BBCTextArea from "../bbc/BBCInput"
import Button from "../dom/Button"
import { useNotificationActions } from "../notifications/state"
import type { TypingStatus } from "../privateChat/types"
import { solidButton } from "../ui/components"
import { useIdentity } from "../user"

type Props = {
  value: string
  maxLength?: number
  onChangeText: (value: string) => void
  onSubmit: (text: string) => void
  onTypingStatusChange?: (typingStatus: TypingStatus) => void
}

export default function ChatInput(props: Props) {
  const identity = useIdentity()
  const notificationActions = useNotificationActions()

  function submit() {
    const maxLength = props.maxLength ?? Infinity
    const valueTrimmed = props.value.trim()
    if (valueTrimmed.length <= maxLength) {
      props.onSubmit(valueTrimmed)
      props.onChangeText("")
    } else {
      notificationActions.addNotification({
        type: "error",
        message: `Your message is too long! Shorten it to ${maxLength} characters or less.`,
        save: false,
        showToast: true,
      })
    }
  }

  const typingStatusTimeout = useRef<number>()
  const lastTypingStatus = useRef<TypingStatus>("clear")

  function handleChangeText(text: string) {
    props.onChangeText(text)

    function updateTypingStatus(typingStatus: TypingStatus) {
      if (typingStatus !== lastTypingStatus.current) {
        props.onTypingStatusChange?.(typingStatus)
        lastTypingStatus.current = typingStatus
      }
    }

    if (text.trim()) {
      updateTypingStatus("typing")

      window.clearTimeout(typingStatusTimeout.current)
      typingStatusTimeout.current = window.setTimeout(() => {
        updateTypingStatus("paused")
      }, 5000)
    } else {
      updateTypingStatus("clear")
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
      <div className="flex-1 mr-2 block">
        <BBCTextArea
          placeholder={`Chatting as ${identity || ""}...`}
          value={props.value}
          onChangeText={handleChangeText}
          maxLength={props.maxLength}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button type="submit" className={solidButton}>
        Send
      </Button>
    </form>
  )
}
