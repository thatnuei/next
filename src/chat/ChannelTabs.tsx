import { observer } from "mobx-react-lite"
import React from "react"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { useChatContext } from "./context"
import { useNavActions, useNavState } from "./nav"
import RoomTab from "./RoomTab"

function ChannelTabs() {
  const { state } = useChatContext()
  const { currentChannel } = useNavState()
  const { setRoom } = useNavActions()

  return state.channels.map((channel) => (
    <RoomTab
      key={channel.id}
      icon={<Icon which={icons.earth} />}
      title={channel.title}
      state={channel === currentChannel ? "active" : "inactive"}
      onClick={() => {
        setRoom({ type: "channel", id: channel.id })
        state.sideMenuOverlay.hide()
      }}
    />
  )) as any
}

export default observer(ChannelTabs)
