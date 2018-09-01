import React from "react"
import { CharacterModel } from "../character/CharacterModel"
import { CharacterName } from "../character/CharacterName"
import { styled } from "../ui/styled"

const messageTypeHighlights = {
  ad: "rgba(39, 174, 96, 0.15)",
  mention: "rgba(41, 128, 185, 0.3)",
  admin: "rgba(231, 76, 60, 0.2)",
  none: "transparent",
}

const senderCharacter = new CharacterModel("Athena Light", "Female", "online")

type Props = {
  type?: keyof typeof messageTypeHighlights
}

export const Message = (props: Props) => {
  return (
    <Container>
      <Highlight style={{ backgroundColor: messageTypeHighlights[props.type || "none"] }}>
        <Timestamp>[{new Date().toLocaleTimeString()}]</Timestamp>
        <Sender>
          <CharacterName character={senderCharacter} />
        </Sender>
        <MessageText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae eros in lacus varius
          semper. Quisque at massa ac risus consectetur semper. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Curabitur pretium ligula non ligula sollicitudin, et varius
          lectus blandit. Vivamus rutrum, turpis a porttitor luctus, metus elit sagittis quam,
          eleifend fringilla mi tortor vel lacus. Nunc ac feugiat urna. Fusce vel diam mollis,
          rutrum odio at, aliquam massa. Praesent at purus vel justo malesuada finibus. Nam sit amet
          sodales magna. Morbi vestibulum pulvinar mauris ac dictum. Curabitur ex est, fringilla
          sodales nisl at, feugiat maximus enim. Nam commodo ultrices ligula sit amet hendrerit.
          Nunc in augue faucibus, ultrices augue consequat, congue ex. Ut a fringilla lectus.
        </MessageText>
      </Highlight>
    </Container>
  )
}

const Container = styled.div`
  &:nth-child(2n) {
    background-color: rgba(0, 0, 0, 0.4);
  }
`

const Highlight = styled.div`
  padding: 0.4rem 0.7rem;
`

const Sender = styled.span`
  margin-right: 0.5rem;
  font-weight: 500;
`

const MessageText = styled.span``

const Timestamp = styled.span`
  font-size: 75%;
  opacity: 0.5;
  float: right;
  margin-left: 0.5rem;
`
