import React from "react"
import { styled } from "../ui/styled"
import { ChannelFilter } from "./ChannelFilter"
import { ChannelModel } from "./ChannelModel"

export interface ChannelHeaderProps {
  channel: ChannelModel
}

export class ChannelHeader extends React.Component<ChannelHeaderProps> {
  render() {
    const { channel } = this.props
    return (
      <HeaderContainer>
        <div style={{ marginRight: "1.5rem" }}>
          <h2>{channel.title}</h2>
        </div>
        <div>
          <ChannelFilter channel={channel} />
        </div>
      </HeaderContainer>
    )
  }
}

const HeaderContainer = styled.div`
  padding: 0.5rem 0.7rem;
  display: flex;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  justify-items: center;
  justify-content: space-between;
`

const ChannelFilterContainer = styled.div`
  flex-shrink: 0;
`
