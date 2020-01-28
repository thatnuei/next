import { observer } from "mobx-react-lite"
import React from "react"
import TextInput from "../dom/components/TextInput"
import { input, solidButton } from "../ui/components"
import Icon from "../ui/components/Icon"
import LoadingIcon from "../ui/components/LoadingIcon"
import VirtualizedList from "../ui/components/VirtualizedList"
import {
  fillArea,
  flexColumn,
  flexGrow,
  flexRow,
  spacedChildrenHorizontal,
} from "../ui/helpers"
import { styled } from "../ui/styled"
import { getThemeColor, spacing } from "../ui/theme"
import ChannelBrowserListItem from "./ChannelBrowserListItem"
import { ChannelBrowserStore } from "./ChannelBrowserStore"
import { ChannelStore } from "./ChannelStore"

type Props = {
  channelBrowserStore: ChannelBrowserStore
  channelStore: ChannelStore
}

function ChannelBrowser({ channelBrowserStore, channelStore }: Props) {
  const sortButtonIcon =
    channelBrowserStore.sortMode === "title"
      ? "sortAlphabetical"
      : "sortNumeric"

  const refreshIcon = channelBrowserStore.isRefreshing ? (
    <LoadingIcon />
  ) : (
    <Icon name="refresh" />
  )

  return (
    <Container>
      <ChannelListContainer>
        <VirtualizedList
          items={channelBrowserStore.displayedEntries}
          itemHeight={40}
          getItemKey={(item) => item.id}
          renderItem={(entry) => (
            <ChannelBrowserListItem entry={entry} channelStore={channelStore} />
          )}
        />
      </ChannelListContainer>

      <Footer>
        <TextInput
          css={input}
          placeholder="Search..."
          value={channelBrowserStore.searchQuery}
          onTextChange={channelBrowserStore.setSearchQuery}
        />
        <button css={solidButton} onClick={channelBrowserStore.cycleSortMode}>
          <Icon name={sortButtonIcon} />
        </button>
        <button
          css={solidButton}
          onClick={channelBrowserStore.refresh}
          disabled={channelBrowserStore.isRefreshing}
        >
          {refreshIcon}
        </button>
      </Footer>
    </Container>
  )
}

export default observer(ChannelBrowser)

const Container = styled.div`
  ${fillArea};
  ${flexColumn};
  background-color: ${getThemeColor("theme2")};
`

const ChannelListContainer = styled.div`
  ${flexGrow};
`

const Footer = styled.div`
  padding: ${spacing.xsmall};
  ${flexRow};
  ${spacedChildrenHorizontal(spacing.xsmall)};
  background-color: ${getThemeColor("theme0")};
`
