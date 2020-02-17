import React from "react"
import Button from "../dom/Button"
import { block, flexRow, hover, ml, opacity, transition } from "../ui/style"
import { ChannelMode } from "./types"

type Props = {
  selectedMode: ChannelMode
  onModeChange: (newMode: ChannelMode) => void
}

export default function ChannelFilters(props: Props) {
  function renderFilterButton(mode: ChannelMode, label: string) {
    const isSelected = props.selectedMode === mode

    const selectedStyle = isSelected
      ? opacity(1)
      : [opacity(0.4), hover(opacity(0.7))]

    return (
      <Button
        css={[
          block,
          ml(4),
          selectedStyle,
          transition("opacity"),
          { whiteSpace: "nowrap" },
        ]}
        onClick={() => props.onModeChange(mode)}
      >
        {label}
      </Button>
    )
  }

  return (
    <div css={[flexRow]}>
      {renderFilterButton("both", "Both")}
      {renderFilterButton("chat", "Chat")}
      {renderFilterButton("ads", "Ads")}
    </div>
  )
}
