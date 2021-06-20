import clsx from "clsx"
import fuzzysearch from "fuzzysearch"
import { sortBy } from "lodash-es"
import { useObservable } from "micro-observables"
import { useState } from "react"
import Button from "../dom/Button"
import { useRootStore } from "../root/context"
import { input, solidButton } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import VirtualizedList from "../ui/VirtualizedList"
import ChannelBrowserItem from "./ChannelBrowserItem"
import { ChannelBrowserChannel } from "./ChannelBrowserStore"

function ChannelBrowser() {
	const root = useRootStore()

	const publicChannels = useObservable(root.channelBrowserStore.publicChannels)
	const privateChannels = useObservable(
		root.channelBrowserStore.privateChannels,
	)
	const isRefreshing = useObservable(root.channelBrowserStore.isRefreshing)

	const [query, setQuery] = useState("")
	const [sortMode, setSortMode] = useState<"title" | "userCount">("title")

	const cycleSortMode = () =>
		setSortMode((mode) => (mode === "title" ? "userCount" : "title"))

	const processChannels = (channels: ChannelBrowserChannel[]) => {
		const normalizedQuery = query.trim().toLowerCase()

		const sorted =
			sortMode === "title"
				? sortBy(channels, (it) => it.title.toLowerCase())
				: sortBy(channels, "userCount").reverse()

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
		<div className={`flex flex-col w-full h-full`}>
			<section
				className={`bg-midnight-2`}
				style={{ height: "calc(100vh - 10rem)" }}
			>
				<VirtualizedList
					items={channels}
					getItemKey={(channel) => channel.id}
					itemSize={40}
					renderItem={({ item, style }) => (
						<ChannelBrowserItem key={item.id} info={item} style={style} />
					)}
				/>
			</section>

			<section className="flex flex-row p-2 space-x-2 bg-midnight-0">
				<input
					type="text"
					aria-label="Search"
					placeholder="Search..."
					className={clsx(input, `flex-1`)}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
				<Button
					title="Change sort mode"
					className={solidButton}
					onClick={cycleSortMode}
				>
					<Icon which={icons.sortAlphabetical} />
				</Button>
				<Button
					title="Refresh"
					className={solidButton}
					onClick={root.channelBrowserStore.refresh}
					disabled={isRefreshing}
				>
					<Icon which={icons.refresh} />
				</Button>
			</section>
		</div>
	)
}

export default ChannelBrowser
