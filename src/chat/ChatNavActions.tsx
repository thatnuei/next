import React, { useState } from "react"
import tw from "twin.macro"
import ChannelBrowser from "../channel/ChannelBrowser"
import * as icons from "../ui/icons"
import Modal from "../ui/Modal"
import NavAction from "./NavAction"
import UpdateStatus from "./UpdateStatus"

function ChatNavActions() {
  const [channelBrowserVisible, setChannelBrowserVisible] = useState(false)
  const [updateStatusVisible, setUpdateStatusVisible] = useState(false)

  return (
    <>
      <NavAction
        icon={icons.list}
        title="Browse channels"
        onClick={() => setChannelBrowserVisible(true)}
      />
      <NavAction
        icon={icons.updateStatus}
        title="Update your status"
        onClick={() => setUpdateStatusVisible(true)}
      />
      <NavAction icon={icons.users} title="See online friends and bookmarks" />
      <NavAction icon={icons.about} title="About next" />
      <div css={tw`flex-1`} />
      <NavAction icon={icons.logout} title="Log out" />

      <Modal
        title="Channels"
        width={480}
        height={720}
        isVisible={channelBrowserVisible}
        onClose={() => setChannelBrowserVisible(false)}
        children={<ChannelBrowser />}
      />

      <Modal
        title="Update Your Status"
        width={480}
        height={360}
        isVisible={updateStatusVisible}
        onClose={() => setUpdateStatusVisible(false)}
        children={
          <UpdateStatus
            initialValues={{ status: "online", statusMessage: "" }}
            onSubmit={(values) => {
              console.log(values)
              setUpdateStatusVisible(false)
            }}
          />
        }
      />
    </>
  )
}

export default ChatNavActions
