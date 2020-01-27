import React from "react"
import { anchor } from "../ui/components"
import Icon, { IconName } from "../ui/components/Icon"
import { inlineBlock } from "../ui/helpers.new"
import { linkIcon } from "./styles"

function ChannelLink(props: { id: string; title: string; icon: IconName }) {
  // const { channelStore } = useRootStore()

  const handleClick = () => {
    // channelStore.join(props.id)
  }

  return (
    <div css={inlineBlock}>
      <Icon name="lock" css={linkIcon} size={0.8} />
      <button css={anchor} onClick={handleClick}>
        {props.title}
      </button>
    </div>
  )
}

export default ChannelLink
