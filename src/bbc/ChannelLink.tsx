import React from "react"
import { useRootStore } from "../RootStore"
import Anchor from "../ui/Anchor"
import { IconName } from "../ui/Icon"
import { LinkIcon } from "./styles"

function ChannelLink(props: { id: string; title: string; icon: IconName }) {
  const { channelStore } = useRootStore()
  return (
    <>
      <LinkIcon icon={props.icon} />
      <Anchor onClick={() => channelStore.join(props.id)}>{props.title}</Anchor>
    </>
  )
}

export default ChannelLink
