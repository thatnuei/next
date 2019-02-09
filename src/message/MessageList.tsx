import React, { useRef } from "react"
import { useBottomScroll } from "../channel/ChannelRoomView"
import { flexGrow, scrollVertical } from "../ui/helpers"
import MessageModel from "./MessageModel"
import MessageRow from "./MessageRow"

export default function MessageList(props: { messages: MessageModel[] }) {
  const messageListRef = useRef<HTMLElement>(null)

  useBottomScroll(messageListRef, props.messages)

  return (
    <section css={[flexGrow, scrollVertical]} ref={messageListRef}>
      {props.messages.slice(-300).map((message) => (
        <MessageRow key={message.id} {...message} />
      ))}
    </section>
  )
}
