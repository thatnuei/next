import React from "react"
import { themeColor } from "../ui/colors"
import Icon from "../ui/Icon"
import { styled } from "../ui/styled"

type ChatRoomHeaderProps = {
  children?: React.ReactNode
}

const ChatRoomHeader = (props: ChatRoomHeaderProps) => {
  return (
    <Container>
      <IconButton onClick={() => {}}>
        <Icon icon="menu" />
      </IconButton>
      <div>{props.children}</div>
    </Container>
  )
}
export default ChatRoomHeader

const Container = styled.header`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0.5rem;
  align-items: center;

  background-color: ${themeColor};
`

const IconButton = styled.button`
  padding: 0.7rem;
  opacity: 0.5;
  transition: 0.3s;

  :hover,
  :focus {
    opacity: 1;
  }
`
