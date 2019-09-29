import { sortBy } from "lodash"
import React, { useMemo } from "react"
import useCycle from "../state/hooks/useCycle"
import { useSelector, useStore } from "../store/hooks"
import {
  getAvailableChannels,
  isChannelBrowserVisible,
} from "../store/selectors"
import Button from "../ui/components/Button"
import Icon from "../ui/components/Icon"
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
import { spacing } from "../ui/theme"
import ChannelBrowserListItem from "./ChannelBrowserListItem"
import { ChannelBrowserEntry } from "./types"

type ListItem = {
  entry: ChannelBrowserEntry
  type: "public" | "private"
}

function ChannelBrowserModal() {
  const isModalVisible = useSelector(isChannelBrowserVisible())
  const channels = useSelector(getAvailableChannels())
  const { actions } = useStore()

  const sortMode = useCycle(["userCount", "title"] as const)

  const listItems = useMemo(() => {
    const sortChannels = (entries: ChannelBrowserEntry[]) =>
      sortMode.current === "title"
        ? sortBy(entries, "title")
        : sortBy(entries, "userCount").reverse()

    return [
      ...sortChannels(channels.public).map<ListItem>((entry) => ({
        entry,
        type: "public",
      })),
      ...sortChannels(channels.private).map<ListItem>((entry) => ({
        entry,
        type: "private",
      })),
    ]
  }, [channels.private, channels.public, sortMode])

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
          <TextInput placeholder="Search..." />
          <Button onClick={sortMode.next}>
            <Icon
              icon={
                sortMode.current === "title"
                  ? "sortAlphabetical"
                  : "sortNumeric"
              }
            />
          </Button>
          <Button>
            <Icon icon="refresh" />
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
`

const ChannelListContainer = styled.div`
  ${flexGrow};
`

const Footer = styled.div`
  padding: ${spacing.xsmall};
  ${flexRow};
  ${spacedChildrenHorizontal(spacing.xsmall)};
`
