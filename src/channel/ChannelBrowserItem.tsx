import React from "react"
import tw from "twin.macro"
import Icon from "../ui/Icon"
import { earth } from "../ui/icons"

type Props = {
  name: string
  userCount: number
  isActive: boolean
}

function ChannelBrowserItem(props: Props) {
  const containerStyle = [
    tw`px-2 py-2 flex flex-row items-center transition-all`,
    props.isActive
      ? tw`opacity-100 bg-background-0`
      : tw`opacity-50 hover:opacity-75`,
  ]

  return (
    <button css={containerStyle}>
      <Icon which={earth} css={tw`mr-2 flex-shrink-0`} />
      <div>{props.name}</div>
      <div css={tw`flex-1 w-12 text-right flex-shrink-0`}>
        {props.userCount}
      </div>
    </button>
  )
}

export default ChannelBrowserItem
