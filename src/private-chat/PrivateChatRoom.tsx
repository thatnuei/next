import { observer } from "mobx-react-lite"
import React from "react"
import { CharacterStore } from "../character/CharacterStore"
import Chatbox from "../chat/Chatbox"
import RoomLayout from "../chat/RoomLayout"
import MessageList from "../message/MessageList"
import PrivateChatHeader from "./PrivateChatHeader"
import { PrivateChatModel } from "./PrivateChatModel"

type Props = {
  chat: PrivateChatModel
  identity: string
  characterStore: CharacterStore
}

function PrivateChatRoom({ chat, identity, characterStore }: Props) {
  const header = (
    <PrivateChatHeader character={characterStore.get(chat.partnerName)} />
  )

  const body = (
    <MessageList
      messages={chat.room.messages}
      characterStore={characterStore}
    />
  )

  const footer = (
    <Chatbox
      value={chat.room.input}
      placeholder={`Chatting as ${identity}...`}
      onValueChange={chat.room.setInput}
      onSubmit={(text) => console.log(`submitted: ${text}`)}
    />
  )

  return <RoomLayout header={header} body={body} footer={footer} />
}

export default observer(PrivateChatRoom)
