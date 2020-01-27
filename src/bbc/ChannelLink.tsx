import React from "react"
import { anchor } from "../ui/components"
import Icon, { IconName } from "../ui/components/Icon"
import { linkIcon } from "./styles"

function ChannelLink(props: { id: string; title: string; icon: IconName }) {
  // const { channelStore } = useRootStore()

  const handleClick = () => {
    // channelStore.join(props.id)
  }

  return (
    <>
      <Icon name="lock" css={linkIcon} size={0.8} />
      <button css={anchor} onClick={handleClick}>
        {props.title}
      </button>
    </>
  )
}

export default ChannelLink
