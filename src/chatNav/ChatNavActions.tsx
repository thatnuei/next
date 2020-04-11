import React from "react"
import tw from "twin.macro"
import { useChatStream } from "../chat/streamContext"
import { TagProps } from "../jsx/types"
import * as icons from "../ui/icons"
import NavAction from "./NavAction"

function ChatNavActions(props: TagProps<"div">) {
  const stream = useChatStream()

  return (
    <div css={tw`flex flex-col`} {...props}>
      <NavAction
        icon={icons.list}
        title="Browse channels"
        onClick={() => stream.send({ type: "open-channel-browser" })}
      />
      <NavAction
        icon={icons.updateStatus}
        title="Update your status"
        onClick={() => stream.send({ type: "show-status-update" })}
      />
      <NavAction icon={icons.users} title="See online friends and bookmarks" />
      <NavAction icon={icons.about} title="About next" />
      <div css={tw`flex-1`} />
      <NavAction
        icon={icons.logout}
        title="Log out"
        onClick={() => stream.send({ type: "log-out" })}
      />
    </div>
  )
}

export default ChatNavActions
