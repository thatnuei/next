import React from "react"
import { Message } from "../message/Message"
import { flist4 } from "../ui/colors"
import { styled } from "../ui/styled"
import { Chatbox } from "./Chatbox"

export const ChatConversationLayout = () => {
  return (
    <Container>
      <HeaderArea>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae eros in lacus varius
        semper. Quisque at massa ac risus consectetur semper. Interdum et malesuada fames ac ante
        ipsum primis in faucibus. Curabitur pretium ligula non ligula sollicitudin, et varius lectus
        blandit. Vivamus rutrum, turpis a porttitor luctus, metus elit sagittis quam, eleifend
        fringilla mi tortor vel lacus. Nunc ac feugiat urna. Fusce vel diam mollis, rutrum odio at,
        aliquam massa. Praesent at purus vel justo malesuada finibus. Nam sit amet sodales magna.
        Morbi vestibulum pulvinar mauris ac dictum. Curabitur ex est, fringilla sodales nisl at,
        feugiat maximus enim. Nam commodo ultrices ligula sit amet hendrerit. Nunc in augue
        faucibus, ultrices augue consequat, congue ex. Ut a fringilla lectus.
      </HeaderArea>
      <SidebarArea>users</SidebarArea>
      <MessagesArea>
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
      </MessagesArea>
      <ChatboxArea>
        <Chatbox onSubmit={console.log} />
      </ChatboxArea>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr auto;
  grid-row-gap: 4px;

  width: 100%;
  height: 100%;
`

const HeaderArea = styled.div`
  background-color: ${flist4};
  overflow-y: auto;
  padding: 0.5rem 0.7rem;
`

const SidebarArea = styled.div`
  background-color: ${flist4};
  grid-row: span 2;
  overflow-y: auto;
  margin-left: 4px;
`

const MessagesArea = styled.div`
  overflow-y: auto;
`

const ChatboxArea = styled.div`
  grid-column: span 2;
`
