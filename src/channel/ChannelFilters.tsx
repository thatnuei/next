import { useObservable } from "micro-observables"
import React from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { TagProps } from "../jsx/types"
import { useChannel } from "./helpers"
import { ChannelMode } from "./types"

type Props = {
  channelId: string
} & TagProps<"div">

function ChannelFilters({ channelId, ...props }: Props) {
  const channel = useChannel(channelId)
  const selectedMode = useObservable(channel.selectedMode)

  function setSelectedMode(mode: ChannelMode) {
    channel.selectedMode.set(mode)
  }

  function renderFilterButton(mode: ChannelMode, label: string) {
    const isSelected = selectedMode === mode

    const style = [
      tw`block whitespace-nowrap transition-opacity`,
      isSelected ? tw`opacity-100` : tw`opacity-50 hover:opacity-75`,
    ]

    return (
      <Button
        css={style}
        onClick={() => setSelectedMode(mode)}
        role="radio"
        aria-checked={isSelected}
      >
        {label}
      </Button>
    )
  }

  return (
    <div css={tw`flex flex-row`} role="radiogroup" {...props}>
      {renderFilterButton("both", "Both")}
      <div css={tw`w-3`} />
      {renderFilterButton("chat", "Chat")}
      <div css={tw`w-3`} />
      {renderFilterButton("ads", "Ads")}
    </div>
  )
}

export default ChannelFilters
