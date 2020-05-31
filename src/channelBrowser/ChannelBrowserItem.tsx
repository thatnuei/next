import React from "react"
import tw from "twin.macro"
import {
  useIsPresent,
  useJoinChannelAction,
  useLeaveChannelAction,
} from "../channel/state"
import { TagProps } from "../jsx/types"
import Icon from "../ui/Icon"
import { earth, lock } from "../ui/icons"
import { ChannelBrowserChannel } from "./state"

type Props = TagProps<"button"> & {
  info: ChannelBrowserChannel
}

function ChannelBrowserItem({ info, ...props }: Props) {
  const isPresent = useIsPresent()(info.id)
  const joinChannel = useJoinChannelAction()
  const leaveChannel = useLeaveChannelAction()

  const handleClick = () => {
    if (isPresent) {
      leaveChannel(info.id)
    } else {
      joinChannel(info.id, info.title)
    }
  }

  const containerStyle = [
    tw`flex flex-row items-center px-2 py-2 transition-all`,
    isPresent
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

export default ChannelBrowserItem
