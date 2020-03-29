import React from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { ChannelMode } from "./ChannelModel"

type Props = {
  selectedMode: ChannelMode
  onModeChange: (newMode: ChannelMode) => void
}

export default function ChannelFilters(props: Props) {
  function renderFilterButton(mode: ChannelMode, label: string) {
    const isSelected = props.selectedMode === mode

    const style = [
      tw`block ml-4 whitespace-no-wrap transition-opacity`,
      isSelected ? tw`opacity-100` : tw`opacity-50 hover:opacity-75`,
    ]

    return (
      <Button
        css={style}
        onClick={() => props.onModeChange(mode)}
        role="radio"
        aria-checked={isSelected}
      >
        {label}
      </Button>
    )
  }

  return (
    <div css={tw`flex flex-row`} role="radiogroup">
      {renderFilterButton("both", "Both")}
      {renderFilterButton("chat", "Chat")}
      {renderFilterButton("ads", "Ads")}
    </div>
  )
}
