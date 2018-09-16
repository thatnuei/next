import { mdiAccountEdit, mdiForum, mdiLogout, mdiSettings } from "@mdi/js"
import React from "react"
import { channelListOverlay } from "../channelList/ChannelList"
import { channelListStore } from "../channelList/ChannelListStore"
import { navigationStore } from "../navigation/NavigationStore"
import { Icon } from "../ui/Icon"
import { styled } from "../ui/styled"
import { updateStatusOverlay } from "./StatusUpdate"

export class ChatActions extends React.Component {
  render() {
    return (
      <Container>
        <section>
          <Action title="Channels" icon={mdiForum} onClick={this.handleChannelListAction} />
          <Action title="Update Status" icon={mdiAccountEdit} onClick={this.handleStatusAction} />
          <Action title="Settings" icon={mdiSettings} />
        </section>
        <section>
          <Action title="Log out" icon={mdiLogout} />
        </section>
      </Container>
    )
  }

  private handleChannelListAction = () => {
    navigationStore.push(channelListOverlay())
    channelListStore.requestChannelList()
  }

  private handleStatusAction = () => {
    navigationStore.push(updateStatusOverlay())
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
  height: 100%;
`

const Action = (props: { title: string; icon: string; onClick?: () => void }) => (
  <ActionAnchor title={props.title} onClick={() => props.onClick && props.onClick()}>
    <Icon path={props.icon} size={1.5} />
  </ActionAnchor>
)

const ActionAnchor = styled.button`
  opacity: 0.5;

  &:hover {
    opacity: 0.75;
  }

  padding: 0.4rem;
  display: block;
`
