import React from "react"
import { ChannelModel } from "../channel/ChannelModel"
import { styled } from "../ui/styled"
import { ChannelFilter } from "./ChannelFilter"

export interface ChannelHeaderProps {
  channel: ChannelModel
}

export class ChannelHeader extends React.Component<ChannelHeaderProps> {
  render() {
    const { channel } = this.props
    return (
      <HeaderContainer>
        <h2>{channel.title}</h2>
        <div style={{ flexGrow: 1 }} />
        <ChannelFilter channel={channel} />
      </HeaderContainer>
    )
  }
}

const HeaderContainer = styled.div`
  padding: 0.5rem 0.7rem;
  display: flex;
  align-items: center;
`
