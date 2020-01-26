import { observer } from "mobx-react-lite"
import React from "react"
import TextInput from "../dom/components/TextInput"
import { input } from "../ui/components"
import Button from "../ui/components/Button"
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
          // @ts-ignore
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
        <Button onClick={channelBrowserStore.cycleSortMode}>
          <Icon name={sortButtonIcon} />
        </Button>
        <Button
          onClick={channelBrowserStore.refresh}
          disabled={channelBrowserStore.isRefreshing}
        >
          {refreshIcon}
        </Button>
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
