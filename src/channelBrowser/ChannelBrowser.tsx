import clsx from "clsx"
import { sortBy } from "lodash-es"
import { matchSorter } from "match-sorter"
import { useEffect, useState } from "react"
import {
  useJoinChannel,
  useJoinedChannels,
  useLeaveChannel,
} from "../channel/state"
import { useChatContext } from "../chat/ChatContext"
import Button from "../dom/Button"
import TextInput from "../dom/TextInput"
import { useStoreValue } from "../state/store"
import { input, solidButton } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import VirtualizedList from "../ui/VirtualizedList"
import ChannelBrowserItem from "./ChannelBrowserItem"
import type { ChannelBrowserChannel } from "./types"

function ChannelBrowser() {
  const context = useChatContext()
  const [query, setQuery] = useState("")
  const [sortMode, setSortMode] = useState<"title" | "userCount">("title")
  const joinChannel = useJoinChannel()
  const leaveChannel = useLeaveChannel()
  const joinedChannels = useJoinedChannels()

  useEffect(() => {
    context.channelBrowserStore.refresh()
  }, [context.channelBrowserStore])

  const cycleSortMode = () =>
    setSortMode((mode) => (mode === "title" ? "userCount" : "title"))

  const processChannels = (channels: ChannelBrowserChannel[]) => {
    const sorted =
      sortMode === "title"
        ? sortBy(channels, (it) => it.title.toLowerCase())
        : sortBy(channels, "userCount").reverse()

    if (!query.trim()) {
      return sorted
    }

    return matchSorter(sorted, query, {
      keys: ["id", "title"],
    })
  }

  const channels = useStoreValue(
    context.channelBrowserStore.channels.select((channels) => [
      ...processChannels(channels.public),
      ...processChannels(channels.private),
    ]),
  )

  const isRefreshing = useStoreValue(context.channelBrowserStore.isRefreshing)

  return (
    <div className={`flex flex-col w-full h-full`}>
      <section
        className={`bg-midnight-2`}
        style={{ height: "calc(100vh - 10rem)" }}
      >
        <VirtualizedList
          items={channels}
          getItemKey={(channel) => channel.id}
          itemSize={40}
          renderItem={({ item, style }) => {
            const joined = joinedChannels.some((ch) => ch.id === item.id)
            return (
              <div style={style}>
                <ChannelBrowserItem
                  info={item}
                  active={joined}
                  onClick={() => {
                    if (joined) {
                      leaveChannel(item.id)
                    } else {
                      joinChannel(item.id, item.title)
                    }
                  }}
                />
              </div>
            )
          }}
        />
      </section>

      <section className="flex flex-row gap-2 p-2 bg-midnight-0">
        <TextInput
          type="text"
          aria-label="Search"
          placeholder="Search..."
          className={clsx(input, `flex-1`)}
          value={query}
          onChangeText={setQuery}
          ref={(input) => input?.focus()}
        />

        <Button
          title="Change sort mode"
          className={solidButton}
          onClick={cycleSortMode}
        >
          {sortMode === "title" ? (
            <Icon which={icons.sortAlphabetical} />
          ) : (
            <Icon which={icons.sortNumeric} />
          )}
        </Button>

        <Button
          title="Refresh"
          className={solidButton}
          onClick={context.channelBrowserStore.refresh}
          disabled={isRefreshing}
        >
          <Icon which={icons.refresh} />
        </Button>
      </section>
    </div>
  )
}

export default ChannelBrowser
