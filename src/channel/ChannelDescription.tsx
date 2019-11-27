import React from "react"
import BBC from "../bbc/BBC"
import { fillArea, scrollVertical } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"

type Props = { description: string }

function ChannelDescription({ description }: Props) {
  return (
    <Container>
      <BBC text={description} />
    </Container>
  )
}

export default ChannelDescription

const Container = styled.div`
  padding: ${spacing.small};
  ${scrollVertical};
  ${fillArea};
`
