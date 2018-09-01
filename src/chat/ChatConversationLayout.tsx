import React from "react"
import { styled } from "../ui/styled"

export const ChatConversationLayout = () => {
  return (
    <Container>
      <div>description</div>
      <div style={{ gridRow: "span 3" }}>users</div>
      <div>messages</div>
      <div>chatbox</div>
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
