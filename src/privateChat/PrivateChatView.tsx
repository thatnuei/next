import React from "react"
import tw from "twin.macro"
import Avatar from "../character/Avatar"
import CharacterName from "../character/CharacterName"
import CharacterStatusText from "../character/CharacterStatusText"
import { Character } from "../character/types"
import MessageList from "../message/MessageList"
import { Message } from "../message/types"
import { scrollVertical } from "../ui/helpers"

type Props = {
  partner: Character
  messages: Message[]
  chatInput: React.ReactNode
  menuButton: React.ReactNode
}

function PrivateChatView({ partner, messages, menuButton, chatInput }: Props) {
  return (
    <div css={tw`flex flex-col w-full h-full`}>
      <div css={tw`flex flex-row items-center p-3 bg-background-0`}>
        {menuButton}
        <Avatar name={partner.name} css={tw`w-12 h-12`} />
        <div css={[tw`flex flex-col ml-5`, scrollVertical, { maxHeight: 60 }]}>
          <CharacterName name={partner.name} gender={partner.gender} />
          <CharacterStatusText {...partner} />
        </div>
      </div>

      <div css={tw`flex flex-row flex-1 min-h-0 my-gap bg-background-1`}>
        <MessageList messages={messages} />
      </div>

      {chatInput}
    </div>
  )
}

export default PrivateChatView
