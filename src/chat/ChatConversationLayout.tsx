import React from "react"
import { styled } from "../ui/styled"
import { Chatbox } from "./Chatbox"

export const ChatConversationLayout = () => {
  return (
    <Container>
      <div>description</div>
      <div style={{ gridRow: "span 2" }}>users</div>
      <div>messages</div>
      <div style={{ gridColumn: "span 2" }}>
        <Chatbox onSubmit={console.log} />
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 12rem;
  grid-template-rows: auto 1fr auto;
  grid-gap: 4px;

  width: 100%;
  height: 100%;
`
