import { mdiEarth } from "@mdi/js"
import { observer } from "mobx-react"
import React from "react"
import { channelStore } from "../channel/ChannelStore"
import { flist4, flist5 } from "../ui/colors"
import { Icon } from "../ui/Icon"
import { css, styled } from "../ui/styled"
import { channelListStore } from "./ChannelListStore"

export interface ChannelListProps {}

@observer
export class ChannelList extends React.Component<ChannelListProps> {
  render() {
    return (
      <Container>
        <TabListContainer>tabs</TabListContainer>
        <ChannelListContainer>
          {channelListStore.publicChannels.map((data) => (
            <ChannelListEntry
              key={data.id}
              active={channelStore.isJoined(data.id)}
              onClick={() => this.handleEntryClick(data.id)}
            >
              <Icon path={mdiEarth} />
              <ChannelListEntryTitle>{data.title}</ChannelListEntryTitle>
              <ChannelListEntryUsers>{data.userCount}</ChannelListEntryUsers>
            </ChannelListEntry>
          ))}
        </ChannelListContainer>
        <SearchContainer>search</SearchContainer>
      </Container>
    )
  }

  private handleEntryClick(id: string) {
    if (channelStore.isJoined(id)) {
      channelStore.leaveChannel(id)
    } else {
      channelStore.joinChannel(id)
    }
  }
}

const Container = styled.div`
  background-color: ${flist5};

  display: flex;
  flex-direction: column;

  width: 24rem;
  max-width: 100%;
  height: 40rem;
  max-height: calc(100vh - 2rem);

  overflow-y: auto;
`

const TabListContainer = styled.div`
  flex-shrink: 0;
`

const ChannelListContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  min-height: 0;
`

const ChannelListEntryTitle = styled.div`
  flex-grow: 1;
  margin: 0rem 0.5rem;
`

const ChannelListEntryUsers = styled.div`
  width: 3rem;
  flex-shrink: 0;
  text-align: right;
`

const SearchContainer = styled.div`
  flex-shrink: 0;
`

const inactiveStyle = css`
  opacity: 0.4;

  :hover {
    opacity: 0.7;
  }
`

const activeStyle = css`
  background-color: ${flist4};
`

const ChannelListEntry = styled.button<{ active?: boolean }>`
  flex-shrink: 0;
  display: flex;
  width: 100%;
  padding: 0.4rem 0.5rem;
  ${(props) => (props.active ? activeStyle : inactiveStyle)};
`
