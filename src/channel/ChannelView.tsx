import { observer } from "mobx-react-lite"
import React from "react"
import BBC from "../bbc/BBC"
import Modal from "../ui/components/Modal"
import { fillArea, flexColumn, scrollVertical } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import useRootStore from "../useRootStore"
import ChannelHeader from "./ChannelHeader"
import ChannelModel from "./ChannelModel"

type Props = { channel: ChannelModel }

function ChannelView({ channel }: Props) {
  const root = useRootStore()

  const description = (
    <Description>
      <BBC text={channel.description} />
    </Description>
  )

  return (
    <Container>
      <ChannelHeader channel={channel} />
      <ContentArea>
        <Modal
          title={channel.name}
          fillMode="contained"
          children={description}
          panelWidth={1200}
          panelHeight={500}
          {...root.chatOverlayStore.channelDescription.overlayProps}
        />
      </ContentArea>
    </Container>
  )
}

export default observer(ChannelView)

const Container = styled.div`
  ${fillArea};
  ${flexColumn};
`

const ContentArea = styled.div`
  flex: 1;
  position: relative;
`

const Description = styled.div`
  padding: ${spacing.small};
  ${scrollVertical};
  ${fillArea};
`
