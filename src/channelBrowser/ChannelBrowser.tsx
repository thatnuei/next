import fuzzysearch from "fuzzysearch"
import { sortBy } from "lodash/fp"
import { useObservable } from "micro-observables"
import React, { useState } from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { TagProps } from "../jsx/types"
import { input, solidButton } from "../ui/components"
import { scrollVertical } from "../ui/helpers"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import VirtualizedList from "../ui/VirtualizedList"
import ChannelBrowserItem from "./ChannelBrowserItem"
import { ChannelBrowserChannel } from "./ChannelBrowserStore"
import { useChannelBrowserStore } from "./helpers"

type Props = TagProps<"div">

function ChannelBrowser(props: Props) {
  const channelBrowserStore = useChannelBrowserStore()
  const publicChannels = useObservable(channelBrowserStore.publicChannels)
  const privateChannels = useObservable(channelBrowserStore.privateChannels)
  const isRefreshing = useObservable(channelBrowserStore.isRefreshing)

  const [query, setQuery] = useState("")
  const [sortMode, setSortMode] = useState<"title" | "userCount">("title")

  const cycleSortMode = () =>
    setSortMode((mode) => (mode === "title" ? "userCount" : "title"))

  const processChannels = (channels: ChannelBrowserChannel[]) => {
    const normalizedQuery = query.trim().toLowerCase()

    const sorted =
      sortMode === "title"
        ? sortBy([(it) => it.title.toLowerCase()], channels)
        : sortBy([(it) => it.userCount], channels).reverse()

    return normalizedQuery
      ? sorted.filter((it) =>
          fuzzysearch(normalizedQuery, it.title.toLowerCase()),
        )
      : sorted
  }

  const channels = [
    ...processChannels(publicChannels),
    ...processChannels(privateChannels),
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
          onClick={channelBrowserStore.refresh}
          disabled={isRefreshing}
        >
          <Icon which={icons.refresh} />
        </Button>
      </footer>
    </div>
  )
}

export default ChannelBrowser
