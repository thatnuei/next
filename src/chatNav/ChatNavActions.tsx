import React from "react"
import { useSetRecoilState } from "recoil"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { useRootStore } from "../root/context"
import { statusOverlayVisibleAtom } from "../statusUpdate/state"
import * as icons from "../ui/icons"
import NavAction from "./NavAction"

function ChatNavActions(props: TagProps<"div">) {
  const root = useRootStore()
  const setStatusOverlayVisible = useSetRecoilState(statusOverlayVisibleAtom)

  return (
    <div
      css={[tw`flex flex-col overflow-y-auto`, { "> *": tw`flex-shrink-0` }]}
      {...props}
    >
      <NavAction
        icon={icons.list}
        title="Browse channels"
        onClick={root.channelBrowserStore.open}
      />
      <NavAction
        icon={icons.updateStatus}
        title="Update your status"
        onClick={() => setStatusOverlayVisible(true)}
      />
      <NavAction icon={icons.users} title="See online friends and bookmarks" />
      <NavAction icon={icons.about} title="About next" />
      <div css={tw`flex-1`} />
      <NavAction
        icon={icons.logout}
        title="Log out"
        onClick={root.appStore.leaveChat}
      />
    </div>
  )
}

export default ChatNavActions
