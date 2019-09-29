import { sortBy } from "lodash"
import React, { useMemo } from "react"
import queryify from "../common/helpers/queryify"
import useInput from "../dom/hooks/useInput"
import useCycle from "../state/hooks/useCycle"
import { useSelector, useStore } from "../store/hooks"
import {
  getAvailableChannels,
  isChannelBrowserVisible,
} from "../store/selectors"
import Button from "../ui/components/Button"
import Icon from "../ui/components/Icon"
import LoadingIcon from "../ui/components/LoadingIcon"
import Modal from "../ui/components/Modal"
import TextInput from "../ui/components/TextInput"
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
import { ChannelBrowserEntry } from "./types"

type ListItem = {
  entry: ChannelBrowserEntry
  type: "public" | "private"
}

function ChannelBrowserModal() {
  const isModalVisible = useSelector(isChannelBrowserVisible())
  const channels = useSelector(getAvailableChannels())
  const { actions, state } = useStore()

  const searchInput = useInput()
  const searchQuery = queryify(searchInput.value)

  const sortMode = useCycle(["userCount", "title"] as const)
  const currentSortMode = sortMode.current

  const createListItem = (type: ListItem["type"]) => (
    entry: ChannelBrowserEntry,
  ) => ({ entry, type })

  const listItems = useMemo(() => {
    const sortChannels = (entries: ChannelBrowserEntry[]) =>
      currentSortMode === "title"
        ? sortBy(entries, "title")
        : sortBy(entries, "userCount").reverse()

    const filterChannels = (entries: ChannelBrowserEntry[]) =>
      entries.filter((entry) => queryify(entry.title).includes(searchQuery))

    const processChannels = (
      entries: ChannelBrowserEntry[],
      type: ListItem["type"],
    ) => sortChannels(filterChannels(entries)).map(createListItem(type))

    return [
      ...processChannels(channels.public, "public"),
      ...processChannels(channels.private, "private"),
    ]
  }, [channels.private, channels.public, searchQuery, currentSortMode])

  const sortButtonIcon =
    sortMode.current === "title" ? "sortAlphabetical" : "sortNumeric"

  const refreshIcon = state.fetchingAvailableChannels ? (
    <LoadingIcon />
  ) : (
    <Icon icon="refresh" />
  )

  return (
    <Modal
      title="Channels"
      visible={isModalVisible}
      panelHeight={600}
      panelWidth={400}
      onClose={actions.channel.hideChannelBrowser}
    >
      <Content>
        <ChannelListContainer>
          <VirtualizedList
            items={listItems}
            itemHeight={40}
            getItemKey={(item) => item.entry.id}
            renderItem={({ entry, type }) => (
              <ChannelBrowserListItem
                entry={entry}
                icon={type === "public" ? "public" : "lock"}
              />
            )}
          />
        </ChannelListContainer>

        <Footer>
          <TextInput placeholder="Search..." {...searchInput.bind} />
          <Button onClick={sortMode.next}>
            <Icon icon={sortButtonIcon} />
          </Button>
          <Button
            onClick={actions.channel.requestAvailableChannels}
            disabled={state.fetchingAvailableChannels}
          >
            {refreshIcon}
          </Button>
        </Footer>
      </Content>
    </Modal>
  )
}

export default ChannelBrowserModal

const Content = styled.div`
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
