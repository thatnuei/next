import { observer } from "mobx-react-lite"
import React from "react"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { useChatContext } from "./context"
import RoomTab from "./RoomTab"

function ChannelTabs() {
  const { channelStore, navStore } = useChatContext()
  return channelStore.channels.map((channel) => (
    <RoomTab
      key={channel.id}
      icon={<Icon which={icons.earth} />}
      title={channel.title}
      state={channel === navStore.currentChannel ? "active" : "inactive"}
      onClick={() => navStore.setRoom({ type: "channel", id: channel.id })}
    />
  )) as any
}

export default observer(ChannelTabs)
