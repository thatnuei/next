import fuzzysearch from "fuzzysearch"
import { sortBy } from "lodash-es"
import { useObservable } from "micro-observables"
import { useState } from "react"
import { tw } from "twind"
import Button from "../dom/Button"
import { TagProps } from "../jsx/types"
import { useRootStore } from "../root/context"
import { input, solidButton } from "../ui/components"
import { scrollVertical } from "../ui/helpers"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import VirtualizedList from "../ui/VirtualizedList"
import ChannelBrowserItem from "./ChannelBrowserItem"
import { ChannelBrowserChannel } from "./ChannelBrowserStore"

type Props = TagProps<"div">

function ChannelBrowser(props: Props) {
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
		<div className={tw`flex flex-col w-full h-full`} {...props}>
			<main
				className={tw([
					tw`flex flex-col flex-1 bg-background-2`,
					scrollVertical,
				])}
			>
				<VirtualizedList
					items={channels}
					getItemKey={(channel) => channel.id}
					itemSize={40}
					renderItem={({ item, style }) => (
						<ChannelBrowserItem key={item.id} info={item} style={style} />
					)}
				/>
			</main>

			<footer className={tw`flex flex-row p-2 bg-background-0`}>
				<input
					type="text"
					aria-label="Search"
					placeholder="Search..."
					className={tw([input, tw`flex-1`])}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
				<Button
					title="Change sort mode"
					className={tw([solidButton, tw`ml-2`])}
					onClick={cycleSortMode}
				>
					<Icon which={icons.sortAlphabetical} />
				</Button>
				<Button
					title="Refresh"
					className={tw([solidButton, tw`ml-2`])}
					onClick={root.channelBrowserStore.refresh}
					disabled={isRefreshing}
				>
					<Icon which={icons.refresh} />
				</Button>
			</footer>
		</div>
	)
}

export default ChannelBrowser
