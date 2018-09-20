import React from "react"
import { ConversationUsersToggle } from "../conversation/ConversationUsersToggle"
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
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            alignItems: "flex-end",
            flexWrap: "wrap",
            padding: "0.5rem",
          }}
        >
          <div style={{ marginRight: "1.5rem", flexGrow: 1 }}>
            <h2>{channel.title}</h2>
          </div>
          <ChannelFilter channel={channel} />
        </div>
        <ConversationUsersToggle users={channel.users} ops={channel.ops} />
      </HeaderContainer>
    )
  }
}

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

const ChannelFilterContainer = styled.div`
  flex-shrink: 0;
`
