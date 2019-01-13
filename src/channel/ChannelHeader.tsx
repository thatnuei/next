import { RouteComponentProps } from "@reach/router"
import React, { useContext } from "react"
import AppStore from "../app/AppStore"
import Button from "../ui/Button"
import { flexGrow } from "../ui/helpers"
import Icon from "../ui/Icon"

export default function ChannelHeader(props: RouteComponentProps<{ id: string }>) {
  const { channelStore } = useContext(AppStore.Context)
  const channel = channelStore.getChannel(props.id || "")

  return (
    <>
      <h2 css={flexGrow}>{channel.name}</h2>
      <Button flat>
        <Icon icon="users" />
      </Button>
    </>
  )
}
