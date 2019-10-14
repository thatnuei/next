import { observer } from 'mobx-react-lite'
import React from 'react'
import ChannelView from '../../channel/ChannelView'
import useRootStore from '../../useRootStore'
import NoRoomHeader from './NoRoomHeader'

function ChatRoomView() {
  const { chatNavigationStore } = useRootStore()
  const { currentRoom } = chatNavigationStore

  if (!currentRoom?.type) {
    return <NoRoomHeader />
  }

  switch (currentRoom.type) {
    case "channel": 
      return <ChannelView channel={currentRoom.channel} />
    case 'privateChat':
      return <p>TODO: private chat</p>
  }
}

export default observer(ChatRoomView)