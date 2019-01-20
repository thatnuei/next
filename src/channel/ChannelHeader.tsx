import React, { useContext } from "react"
import AppStore from "../app/AppStore"
import { useRouter } from "../router"
import Button from "../ui/Button"
import { flexGrow } from "../ui/helpers"
import Icon from "../ui/Icon"
import { css } from "../ui/styled"

export default function ChannelHeader() {
  const { channelStore } = useContext(AppStore.Context)
  const { param } = useRouter()
  const channel = channelStore.getChannel(param("id"))

  return (
    <>
      <h2 css={[flexGrow, channelNameStyle]}>{channel.name}</h2>
      <Button flat>
        <Icon icon="users" />
      </Button>
    </>
  )
}

const channelNameStyle = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
