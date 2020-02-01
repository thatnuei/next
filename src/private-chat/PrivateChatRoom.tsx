import { observer } from "mobx-react-lite"
import React from "react"
import Chatbox from "../chat/Chatbox"
import { useCharacterStore, useIdentity } from "../chat/ChatContext"
import RoomLayout from "../chat/RoomLayout"
import MessageList from "../message/MessageList"
import PrivateChatHeader from "./PrivateChatHeader"
import { PrivateChatModel } from "./PrivateChatModel"

type Props = {
  chat: PrivateChatModel
}

function PrivateChatRoom({ chat }: Props) {
  const identity = useIdentity()
  const characterStore = useCharacterStore()

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
