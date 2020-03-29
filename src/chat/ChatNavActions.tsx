import React from "react"
import tw from "twin.macro"
import * as icons from "../ui/icons"
import { useChatContext } from "./context"
import NavAction from "./NavAction"

function ChatNavActions() {
  const { navStore } = useChatContext()

  return (
    <>
      <NavAction
        icon={icons.list}
        title="Browse channels"
        onClick={navStore.channelBrowser.show}
      />
      <NavAction
        icon={icons.updateStatus}
        title="Update your status"
        onClick={navStore.updateStatus.show}
      />
      <NavAction icon={icons.users} title="See online friends and bookmarks" />
      <NavAction icon={icons.about} title="About next" />
      <div css={tw`flex-1`} />
      <NavAction icon={icons.logout} title="Log out" />
    </>
  )
}

export default ChatNavActions
