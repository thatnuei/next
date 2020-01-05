import { observer } from "mobx-react-lite"
import React from "react"
import { CharacterStore } from "../character/CharacterStore.new"
import Chatbox from "../chat/components/Chatbox"
import RoomLayout from "../chat/components/RoomLayout"
import MessageList from "../message/MessageList"
import PrivateChatHeader from "./PrivateChatHeader"
import { PrivateChat } from "./types"

type Props = {
  chat: PrivateChat
  identity: string
  characterStore: CharacterStore
}

function PrivateChatRoom({ chat, identity, characterStore }: Props) {
  return (
    <RoomLayout
      header={
        <PrivateChatHeader character={characterStore.get(chat.partnerName)} />
      }
      body={
        <MessageList messages={chat.messages} characterStore={characterStore} />
      }
      footer={
        <Chatbox
          value={chat.input}
          placeholder={`Chatting as ${identity}...`}
          onValueChange={(value) => (chat.input = value)}
          onSubmit={(text) => console.log(`submitted: ${text}`)}
        />
      }
    />
  )
}

export default observer(PrivateChatRoom)
