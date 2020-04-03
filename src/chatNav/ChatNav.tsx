import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import CharacterSummary from "../character/CharacterSummary"
import { useChatContext } from "../chat/context"
import { TagProps } from "../jsx/types"
import ChatNavActions from "./ChatNavActions"
import RoomTabList from "./RoomTabList"

function ChatNav(props: TagProps<"nav">) {
  const { state, identity } = useChatContext()
  return (
    <nav css={tw`flex`} {...props}>
      <div css={tw`flex flex-col mr-gap`}>
        <ChatNavActions />
      </div>
      <div css={tw`flex flex-col w-56`}>
        <CharacterSummary
          character={state.characters.get(identity)}
          css={tw`p-3 bg-background-0 mb-gap`}
        />
        <div css={tw`flex-1 bg-background-1`}>
          <RoomTabList />
        </div>
      </div>
    </nav>
  )
}

export default observer(ChatNav)
