import React from "react"
import tw from "twin.macro"
import { useChannelBrowserActions } from "../channelBrowser/state"
import { useStatusUpdateActions } from "../statusUpdate/state"
import * as icons from "../ui/icons"
import NavAction from "./NavAction"

function ChatNavActions() {
  const { openChannelBrowser } = useChannelBrowserActions()
  const { showStatusUpdateScreen } = useStatusUpdateActions()

  return (
    <>
      <NavAction
        icon={icons.list}
        title="Browse channels"
        onClick={openChannelBrowser}
      />
      <NavAction
        icon={icons.updateStatus}
        title="Update your status"
        onClick={showStatusUpdateScreen}
      />
      <NavAction icon={icons.users} title="See online friends and bookmarks" />
      <NavAction icon={icons.about} title="About next" />
      <div css={tw`flex-1`} />
      <NavAction icon={icons.logout} title="Log out" />
    </>
  )
}

export default ChatNavActions
