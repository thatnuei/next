import { mdiAccountMultiple } from "@mdi/js"
import React from "react"
import MediaQuery from "react-responsive"
import { appStore } from "../store"
import { Button } from "../ui/Button"
import { Icon } from "../ui/Icon"
import { styled } from "../ui/styled"
import { userListBreakpoint } from "./breakpoints"
import { ChannelFilter } from "./ChannelFilter"
import { ChannelModel } from "./ChannelModel"
import { channelUserListOverlay } from "./ChannelUserList"

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

        <MediaQuery maxWidth={userListBreakpoint}>
          <Button flat onClick={this.showUserListOverlay}>
            <Icon path={mdiAccountMultiple} />
          </Button>
        </MediaQuery>
      </HeaderContainer>
    )
  }

  private showUserListOverlay = () => {
    const { users, ops } = this.props.channel
    appStore.navigationStore.push(channelUserListOverlay(users, ops))
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
