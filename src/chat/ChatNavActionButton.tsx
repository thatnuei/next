import Button from "../dom/Button"
import type { ChatNavActionProps } from "./ChatNavAction"
import ChatNavAction from "./ChatNavAction"

type ChatNavActionButtonProps = {
  onClick?: () => void
} & ChatNavActionProps

export default function ChatNavActionButton({
  onClick,
  ...props
}: ChatNavActionButtonProps) {
  return (
    <Button onClick={() => onClick?.()}>
      <ChatNavAction {...props} />
    </Button>
  )
}
