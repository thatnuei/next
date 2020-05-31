import React from "react"
import tw from "twin.macro"
import { useIsPresent } from "../channel/state"
import { useChatStream } from "../chat/streamContext"
import { TagProps } from "../jsx/types"
import Icon from "../ui/Icon"
import { earth, lock } from "../ui/icons"
import { ChannelBrowserChannel } from "./state"

type Props = TagProps<"button"> & {
  info: ChannelBrowserChannel
}

function ChannelBrowserItem({ info, ...props }: Props) {
  const stream = useChatStream()
  const isPresent = useIsPresent()(info.id)

  const handleClick = () => {
    if (isPresent) {
      stream.send({ type: "join-channel", id: info.id, title: info.title })
    } else {
      stream.send({ type: "leave-channel", id: info.id })
    }
  }

  const containerStyle = [
    tw`flex flex-row items-center px-2 py-2 transition-all`,
    isPresent
      ? tw`opacity-50 hover:opacity-75`
      : tw`opacity-100 bg-background-0`,
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
