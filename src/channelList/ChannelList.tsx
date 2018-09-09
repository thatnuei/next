import { mdiEarth, mdiKeyVariant } from "@mdi/js"
import { action, computed, IReactionDisposer, observable, reaction } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowRenderer,
  Size,
} from "react-virtualized"
import { channelStore } from "../channel/ChannelStore"
import { queryify } from "../helpers/string"
import { flist4, flist5 } from "../ui/colors"
import { Icon } from "../ui/Icon"
import { css, styled } from "../ui/styled"
import { TextInput } from "../ui/TextInput"
import { ChannelListData, channelListStore } from "./ChannelListStore"

export interface ChannelListProps {}

type ChannelListTabData = {
  title: string
  channels: ChannelListData[]
  icon: string
}

@observer
export class ChannelList extends React.Component<ChannelListProps> {
  @observable
  private tabIndex = 0

  @observable
  private searchText = ""

  private cellMeasurerCache = new CellMeasurerCache({
    defaultHeight: 50,
    fixedWidth: true,
  })

  private disposeChannelListWatcher?: IReactionDisposer

  @computed
  private get tabs(): ChannelListTabData[] {
    return [
      {
        title: "Public Channels",
        channels: channelListStore.publicChannels,
        icon: mdiEarth,
      },
      {
        title: "Private Channels",
        channels: channelListStore.privateChannels,
        icon: mdiKeyVariant,
      },
    ]
  }

  @computed
  private get processedChannels() {
    const currentTab = this.tabs[this.tabIndex]
    const searchText = queryify(this.searchText)

    return currentTab.channels
      .filter((channel) => queryify(channel.title).includes(searchText))
      .sort((a, b) => a.title.localeCompare(b.title))
  }

  @action
  private setTabIndex(index: number) {
    this.tabIndex = index
  }

  @action.bound
  private handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.searchText = event.target.value
  }

  private handleEntryClick(id: string) {
    if (channelStore.isJoined(id)) {
      channelStore.leaveChannel(id)
    } else {
      channelStore.joinChannel(id)
    }
  }

  private renderChannelList = (size: Size) => {
    return (
      <List
        {...size}
        rowHeight={this.cellMeasurerCache.rowHeight}
        rowCount={this.processedChannels.length}
        rowRenderer={this.renderChannelRow}
        deferredMeasurementCache={this.cellMeasurerCache}
      />
    )
  }

  private renderChannelRow: ListRowRenderer = (row) => {
    const channel = this.processedChannels[row.index] as ChannelListData | undefined

    const content = channel && (
      <ChannelListEntry
        style={row.style}
        active={channelStore.isJoined(channel.id)}
        onClick={() => this.handleEntryClick(channel.id)}
      >
        <Icon path={mdiEarth} />
        <ChannelListEntryTitle dangerouslySetInnerHTML={{ __html: channel.title }} />
        <ChannelListEntryUsers>{channel.userCount}</ChannelListEntryUsers>
      </ChannelListEntry>
    )

    return (
      <CellMeasurer
        cache={this.cellMeasurerCache}
        key={row.key}
        parent={row.parent}
        rowIndex={row.index}
      >
        {content}
      </CellMeasurer>
    )
  }

  componentDidMount() {
    this.disposeChannelListWatcher = reaction(
      () => this.processedChannels,
      () => {
        this.cellMeasurerCache.clearAll()
      },
    )
  }

  componentWillUnmount() {
    if (this.disposeChannelListWatcher) {
      this.disposeChannelListWatcher()
    }
  }

  render() {
    return (
      <Container>
        <TabListContainer>
          {this.tabs.map((tab, index) => (
            <Tab
              key={index}
              active={this.tabIndex === index}
              onClick={() => this.setTabIndex(index)}
            >
              {tab.title}
            </Tab>
          ))}
        </TabListContainer>

        <ChannelListContainer>
          <AutoSizer channelCount={this.processedChannels.length}>
            {this.renderChannelList}
          </AutoSizer>
        </ChannelListContainer>

        <SearchContainer>
          <TextInput
            value={this.searchText}
            onChange={this.handleSearchChange}
            placeholder="Search for channels..."
          />
        </SearchContainer>
      </Container>
    )
  }
}

const inactiveStyle = css`
  opacity: 0.4;

  :hover {
    opacity: 0.7;
  }
`

const activeStyle = css`
  background-color: ${flist4};
`

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

  display: flex;
  flex-direction: row;
  justify-content: stretch;
`

const Tab = styled.button<{ active?: boolean }>`
  flex-grow: 1;
  padding: 0.6rem;
  text-align: center;

  ${(props) => (props.active ? activeStyle : inactiveStyle)};
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
  background-color: ${flist4};
  padding: 4px;
`

const ChannelListEntry = styled.button<{ active?: boolean }>`
  flex-shrink: 0;
  display: flex;
  width: 100%;
  padding: 0.4rem 0.5rem;
  ${(props) => (props.active ? activeStyle : inactiveStyle)};
`
