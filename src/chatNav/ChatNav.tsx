import React from "react"
import tw from "twin.macro"
import CharacterSummary from "../character/CharacterSummary"
import { useChatCredentials } from "../chat/helpers"
import { TagProps } from "../jsx/types"
import ChatNavActions from "./ChatNavActions"
import RoomTabList from "./RoomTabList"

function ChatNav(props: TagProps<"nav">) {
  const { identity } = useChatCredentials()
  return (
    <nav css={tw`flex`} {...props}>
      <ChatNavActions />
      <div css={tw`flex flex-col w-56 overflow-y-auto bg-background-1`}>
        <CharacterSummary
          name={identity}
          css={tw`p-3 bg-background-0 mb-gap`}
        />
        <div css={tw`flex-1`}>
          <RoomTabList />
        </div>
      </div>
    </nav>
  )
}

export default ChatNav
