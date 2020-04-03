import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import Avatar from "../character/Avatar"
import CharacterName from "../character/CharacterName"
import CharacterStatusText from "../character/CharacterStatusText"
import ChatInput from "../chat/ChatInput"
import { useChatContext } from "../chat/context"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import { TagProps } from "../jsx/types"
import MessageList from "../message/MessageList"
import { scrollVertical } from "../ui/helpers"
import { PrivateChatModel } from "./state"

type Props = {
  chat: PrivateChatModel
} & TagProps<"div">

function PrivateChatView({ chat, ...props }: Props) {
  const { state } = useChatContext()
  const character = state.characters.get(chat.partnerName)

  return (
    <div css={tw`flex flex-col`} {...props}>
      <div css={tw`flex flex-row items-center p-3 bg-background-0`}>
        <ChatMenuButton css={tw`mr-3`} />
        <Avatar name={chat.partnerName} css={tw`w-12 h-12`} />
        <div css={[tw`flex flex-col ml-3`, scrollVertical, { maxHeight: 60 }]}>
          <CharacterName character={character} />
          <CharacterStatusText character={character} />
        </div>
      </div>

      <div css={tw`flex flex-row flex-1 min-h-0 my-gap bg-background-1`}>
        <MessageList messages={chat.messageList.items} />
      </div>

      <ChatInput />
    </div>
  )
}

export default observer(PrivateChatView)
