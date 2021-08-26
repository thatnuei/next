import clsx from "clsx"
import { fadedButton } from "../ui/components"

export type ChatNavActionProps = {
  name: string
  icon: React.ReactNode
  active?: boolean
}

export default function ChatNavAction({
  name,
  icon,
  active,
}: ChatNavActionProps) {
  return (
    <div
      title={name}
      className={clsx(fadedButton, `block p-3`, active && `bg-midnight-0`)}
    >
      {icon}
    </div>
  )
}
