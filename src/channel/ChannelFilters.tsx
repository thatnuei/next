import clsx from "clsx"
import type { ReactNode } from "react"
import { useChatContext } from "../chat/ChatContext"
import Button from "../dom/Button"
import type { ChannelMode } from "./types"
import { useChannelKeys } from "./useChannelKeys"

type Props = {
  channelId: string
}

function ChannelFilters({ channelId, ...props }: Props) {
  const context = useChatContext()
  const { mode, selectedMode } = useChannelKeys(channelId, [
    "mode",
    "selectedMode",
  ])

  function buttonProps(mode: ChannelMode) {
    return {
      onClick: () => context.channelStore.setSelectedMode(channelId, mode),
      active: selectedMode === mode,
    }
  }

  if (mode === "ads") {
    return (
      <div className="flex flex-row gap-3" role="radiogroup" {...props}>
        <FilterButton disabled>Chat</FilterButton>
        <FilterButton active>Ads</FilterButton>
        <FilterButton disabled>Both</FilterButton>
      </div>
    )
  }

  if (mode === "chat") {
    return (
      <div className="flex flex-row gap-3" role="radiogroup" {...props}>
        <FilterButton active>Chat</FilterButton>
        <FilterButton disabled>Ads</FilterButton>
        <FilterButton disabled>Both</FilterButton>
      </div>
    )
  }

  return (
    <div className="flex flex-row gap-3" role="radiogroup" {...props}>
      <FilterButton {...buttonProps("chat")}>Chat</FilterButton>
      <FilterButton {...buttonProps("ads")}>Ads</FilterButton>
      <FilterButton {...buttonProps("both")}>Both</FilterButton>
    </div>
  )
}

export default ChannelFilters

function FilterButton({
  children,
  active,
  disabled,
  onClick,
}: {
  children: ReactNode
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <Button
      className={clsx(
        "block transition-opacity whitespace-nowrap",
        active ? `opacity-100` : `opacity-50 hover:opacity-75`,
        disabled && "opacity-25 pointer-events-none",
      )}
      onClick={onClick ?? (() => {})}
      role="radio"
      aria-checked={active ?? false}
      aria-disabled={disabled ?? false}
    >
      {children}
    </Button>
  )
}
