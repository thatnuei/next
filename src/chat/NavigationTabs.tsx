import { sortBy } from "lodash"
import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../character/Avatar"
import { useRootStore } from "../RootStore"
import Icon from "../ui/Icon"
import { ChatTab } from "./ChatNavigationStore"
import RoomTab from "./RoomTab"

function NavigationTabs() {
  const {
    channelStore,
    privateChatStore,
    overlayStore,
    chatNavigationStore,
  } = useRootStore()

  const renderTab = (tab: ChatTab) => {
    const active = chatNavigationStore.isActive(tab)

    const handleActivate = () => {
      chatNavigationStore.showTab(tab)
      overlayStore.chatNav.close()
    }

    const handleClose = () => {
      chatNavigationStore.removeTab(tab)
    }

    switch (tab.type) {
      case "console":
        return (
          <RoomTab
            icon={<Icon icon="console" size={0.9} />}
            title="Console"
            active={active}
            onClick={handleActivate}
          />
        )

      case "channel": {
        const channel = channelStore.channels.get(tab.channelId)
        return (
          <RoomTab
            key={channel.id}
            icon={<Icon icon="channels" size={0.9} />}
            title={channel.name}
            active={active}
            unread={channel.unread}
            onClick={() => {
              handleActivate()
              channel.markRead()
            }}
            onClose={handleClose}
          />
        )
      }

      case "privateChat": {
        const chat = privateChatStore.privateChats.get(tab.partnerName)
        return (
          <RoomTab
            key={chat.partner}
            icon={<Avatar name={chat.partner} size={20} />}
            title={chat.partner}
            active={active}
            unread={chat.unread}
            onClick={() => {
              handleActivate()
              chat.markRead()
            }}
            onClose={handleClose}
          />
        )
      }
    }
  }

  const getTypeOrder = (tab: ChatTab) => {
    const typeOrder: Record<ChatTab["type"], number> = {
      console: 0,
      channel: 1,
      privateChat: 2,
    }
    return typeOrder[tab.type]
  }

  const getTitle = (tab: ChatTab) => {
    if (tab.type === "channel") {
      const channel = channelStore.channels.get(tab.channelId)
      return channel.name
    }

    if (tab.type === "privateChat") {
      return tab.partnerName
    }

    return "Console"
  }

  const sortedTabs = sortBy(chatNavigationStore.tabs, getTypeOrder, getTitle)

  return sortedTabs.map((tab, index) => (
    <React.Fragment key={index}>{renderTab(tab)}</React.Fragment>
  )) as any
}

export default observer(NavigationTabs)
