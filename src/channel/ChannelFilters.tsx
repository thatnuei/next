import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { TagProps } from "../jsx/types"
import { ChannelMode, ChannelModel } from "./state"

type Props = {
  channel: ChannelModel
} & TagProps<"div">

function ChannelFilters({ channel, ...props }: Props) {
  function renderFilterButton(mode: ChannelMode, label: string) {
    const isSelected = channel.selectedMode === mode

    const style = [
      tw`block whitespace-no-wrap transition-opacity`,
      isSelected ? tw`opacity-100` : tw`opacity-50 hover:opacity-75`,
    ]

    return (
      <Button
        css={style}
        onClick={() => channel.setSelectedMode(mode)}
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

export default observer(ChannelFilters)
