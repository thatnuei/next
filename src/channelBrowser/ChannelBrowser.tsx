import fuzzysearch from "fuzzysearch"
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import tw from "twin.macro"
import { useChatContext } from "../chat/context"
import { compare, compareReverse } from "../common/compare"
import Button from "../dom/Button"
import { TagProps } from "../jsx/types"
import { input, solidButton } from "../ui/components"
import { scrollVertical } from "../ui/helpers"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import VirtualizedList from "../ui/VirtualizedList"
import ChannelBrowserItem from "./ChannelBrowserItem"
import { ChannelBrowserItemInfo, useChannelBrowserActions } from "./state"

type Props = TagProps<"div">

function ChannelBrowser(props: Props) {
  const { state } = useChatContext()
  const { refresh } = useChannelBrowserActions()
  const [query, setQuery] = useState("")
  const [sortMode, setSortMode] = useState<"title" | "userCount">("title")

  const cycleSortMode = () =>
    setSortMode((mode) => (mode === "title" ? "userCount" : "title"))

  const processChannels = (channels: ChannelBrowserItemInfo[]) => {
    const normalizedQuery = query.trim().toLowerCase()

    const sorted =
      sortMode === "title"
        ? [...channels].sort(compare((it) => it.title.toLowerCase()))
        : [...channels].sort(compareReverse((it) => it.userCount))

    return normalizedQuery
      ? sorted.filter((it) =>
          fuzzysearch(normalizedQuery, it.title.toLowerCase()),
        )
      : sorted
  }

  const channels = [
    ...processChannels(state.channelBrowser.publicChannels),
    ...processChannels(state.channelBrowser.privateChannels),
  ]

  return (
    <div css={tw`flex flex-col w-full h-full`} {...props}>
      <main css={[tw`flex flex-col flex-1 bg-background-2`, scrollVertical]}>
        <VirtualizedList
          items={channels}
          getItemKey={(channel) => channel.id}
          itemSize={40}
          renderItem={({ item, style }) => (
            <ChannelBrowserItem key={item.id} info={item} style={style} />
          )}
        />
      </main>

      <footer css={tw`flex flex-row p-2 bg-background-0`}>
        <input
          type="text"
          aria-label="Search"
          placeholder="Search..."
          css={[input, tw`flex-1`]}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button
          title="Change sort mode"
          css={[solidButton, tw`ml-2`]}
          onClick={cycleSortMode}
        >
          <Icon which={icons.sortAlphabetical} />
        </Button>
        <Button
          title="Refresh"
          css={[solidButton, tw`ml-2`]}
          onClick={refresh}
          disabled={!state.channelBrowser.canRefresh}
        >
          <Icon which={icons.refresh} />
        </Button>
      </footer>
    </div>
  )
}

export default observer(ChannelBrowser)
