import React from "react"
import { IconName } from "../ui/components/Icon"
import { LinkIcon } from "./styles"

function ChannelLink(props: { id: string; title: string; icon: IconName }) {
  // const { channelStore } = useRootStore()

  const handleClick = () => {
    // channelStore.join(props.id)
  }

  return (
    <>
      <LinkIcon name={props.icon} />
      <button className="anchor" onClick={handleClick}>
        {props.title}
      </button>
    </>
  )
}

export default ChannelLink
