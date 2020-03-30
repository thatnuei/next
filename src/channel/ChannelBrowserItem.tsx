import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import { useChatContext } from "../chat/context"
import { TagProps } from "../jsx/types"
import Icon from "../ui/Icon"
import { earth, lock } from "../ui/icons"
import { ChannelBrowserItemInfo } from "./ChannelBrowserStore"

type Props = TagProps<"button"> & {
  info: ChannelBrowserItemInfo
}

function ChannelBrowserItem({ info, ...props }: Props) {
  const { channelStore } = useChatContext()

  const isJoined = channelStore.isJoined(info.id)

  const handleClick = () => {
    if (isJoined) {
      channelStore.leave(info.id)
    } else {
      channelStore.join(info.id)
    }
  }

  const containerStyle = [
    tw`flex flex-row items-center px-2 py-2 transition-all`,
    isJoined
      ? tw`opacity-100 bg-background-0`
      : tw`opacity-50 hover:opacity-75`,
  ]

  return (
    <button css={containerStyle} onClick={handleClick} {...props}>
      <Icon
        which={info.type === "public" ? earth : lock}
        css={tw`flex-shrink-0 mr-2`}
      />
      <div dangerouslySetInnerHTML={{ __html: info.title }} />
      <div css={tw`flex-1 flex-shrink-0 w-12 text-right`}>{info.userCount}</div>
    </button>
  )
}

export default observer(ChannelBrowserItem)
