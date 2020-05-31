import { observer } from "mobx-react-lite"
import React from "react"
import { useRecoilState } from "recoil"
import tw from "twin.macro"
import Button from "../dom/Button"
import { TagProps } from "../jsx/types"
import { channelAtom } from "./state"
import { ChannelMode } from "./types"

type Props = {
  channelId: string
} & TagProps<"div">

function ChannelFilters({ channelId, ...props }: Props) {
  const [channel, setChannel] = useRecoilState(channelAtom(channelId))

  function setSelectedMode(mode: ChannelMode) {
    setChannel((prev) => ({ ...prev, mode }))
  }

  function renderFilterButton(mode: ChannelMode, label: string) {
    const isSelected = channel.selectedMode === mode

    const style = [
      tw`block whitespace-no-wrap transition-opacity`,
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

export default observer(ChannelFilters)
