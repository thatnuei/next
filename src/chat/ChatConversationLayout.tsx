import React from "react"
import { Message } from "../message/Message"
import { styled } from "../ui/styled"
import { Chatbox } from "./Chatbox"

export const ChatConversationLayout = () => {
  return (
    <Container>
      <div>description</div>
      <div style={{ gridRow: "span 2" }}>users</div>
      <div style={{ overflowY: "auto" }}>
        <Message type="admin" />
        <Message />
        <Message type="ad" />
        <Message />
        <Message type="ad" />
        <Message />
        <Message type="mention" />
        <Message />
        <Message />
        <Message type="ad" />
        <Message type="ad" />
        <Message />
        <Message />
        <Message />
      </div>
      <div style={{ gridColumn: "span 2" }}>
        <Chatbox onSubmit={console.log} />
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr auto;
  grid-gap: 4px;

  width: 100%;
  height: 100%;
`
