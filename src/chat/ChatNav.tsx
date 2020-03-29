import React from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import ChannelTabs from "./ChannelTabs"
import ChatNavActions from "./ChatNavActions"

export default function ChatNav(props: TagProps<"nav">) {
  return (
    <nav css={tw`flex`} {...props}>
      <div css={tw`flex flex-col mr-gap`}>
        <ChatNavActions />
      </div>
      <div css={tw`flex flex-col w-56`}>
        {/* <CharacterDetails
              character={testificate}
              css={tw`p-3 bg-background-0 mb-gap`}
            /> */}
        <div css={tw`flex-1 bg-background-1`}>
          <ChannelTabs />
        </div>
      </div>
    </nav>
  )
}
