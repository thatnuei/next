import { observer } from 'mobx-react-lite'
import React from 'react'
import useRootStore from '../../useRootStore'

function ChatRoomView() {
  const { chatNavigationStore, channelStore } = useRootStore()
  const { currentRoom } = chatNavigationStore

  if (!currentRoom?.type) {
    return <p>lol</p>
  }

  switch (currentRoom.type) {
    case "channel": {
      const channel = channelStore.channels.get(currentRoom.id)
      return <p>{channel.name}</p>
    }

    case 'privateChat':
      return <p>TODO: private chat</p>
  }
}

export default observer(ChatRoomView)