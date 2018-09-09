import { mdiAccountEdit, mdiForum, mdiLogout, mdiSettings } from "@mdi/js"
import React from "react"
import { channelListStore } from "../channelList/ChannelListStore"
import { Icon } from "../ui/Icon"
import { styled } from "../ui/styled"
import { chatViewStore } from "./ChatViewStore"

export class ChatActions extends React.Component {
  render() {
    return (
      <Container>
        <section>
          <Action title="Channels" icon={mdiForum} onClick={this.handleChannelListAction} />
          <Action title="Update Status" icon={mdiAccountEdit} />
          <Action title="Settings" icon={mdiSettings} />
        </section>
        <section>
          <Action title="Log out" icon={mdiLogout} />
        </section>
      </Container>
    )
  }

  private handleChannelListAction = () => {
    chatViewStore.channelListDisplay.enable()
    channelListStore.requestChannelList()
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
