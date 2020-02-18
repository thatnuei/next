import { css } from "@emotion/react"
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
        css={[selectedStyle, filterButtonStyle]}
        onClick={() => props.onModeChange(mode)}
        role="radio"
        aria-checked={isSelected}
      >
        {label}
      </Button>
    )
  }

  return (
    <div css={[flexRow]} role="radiogroup">
      {renderFilterButton("both", "Both")}
      {renderFilterButton("chat", "Chat")}
      {renderFilterButton("ads", "Ads")}
    </div>
  )
}

const filterButtonStyle = [
  block,
  ml(4),
  transition("opacity"),
  css({ whiteSpace: "nowrap" }),
]
