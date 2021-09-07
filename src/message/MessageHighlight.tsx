import type { ReactNode } from "react"
import type { MessageState } from "./MessageState"

export default function MessageHighlight({
  message,
  children,
}: {
  message: MessageState
  children: ReactNode
}) {
  const typeStyle = {
    normal: undefined,
    action: `italic`,
    lfrp: `bg-green-500/20`,
    warning: `bg-red-500/20`,
    system: `bg-black/50`,
  }[message.type]

  return <div className={typeStyle}>{children}</div>
}
