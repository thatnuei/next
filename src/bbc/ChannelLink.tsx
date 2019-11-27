import React from "react"
import Anchor from "../ui/components/Anchor"
import { IconName } from "../ui/components/Icon"
import { LinkIcon } from "./styles"

function ChannelLink(props: { id: string; title: string; icon: IconName }) {
  // const { channelStore } = useRootStore()

  const handleClick = () => {
    // channelStore.join(props.id)
  }

  return (
    <>
      <LinkIcon icon={props.icon} />
      <Anchor onClick={handleClick}>{props.title}</Anchor>
    </>
  )
}

export default ChannelLink
