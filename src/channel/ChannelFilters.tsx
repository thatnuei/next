import { useObservable } from "micro-observables"
import Button from "../dom/Button"
import { useChannel } from "./helpers"
import { ChannelMode } from "./types"

type Props = {
	channelId: string
}

function ChannelFilters({ channelId, ...props }: Props) {
	const channel = useChannel(channelId)
	const selectedMode = useObservable(channel.selectedMode)

	function setSelectedMode(mode: ChannelMode) {
		channel.selectedMode.set(mode)
	}

	function renderFilterButton(mode: ChannelMode, label: string) {
		const isSelected = selectedMode === mode

		return (
			<Button
				tw={`block transition-opacity whitespace-nowrap ${
					isSelected ? `opacity-100` : `opacity-50 hover:opacity-75`
				}`}
				onClick={() => setSelectedMode(mode)}
				role="radio"
				aria-checked={isSelected}
			>
				{label}
			</Button>
		)
	}

	return (
		<div tw="flex flex-row" role="radiogroup" {...props}>
			{renderFilterButton("both", "Both")}
			<div tw="w-3" />
			{renderFilterButton("chat", "Chat")}
			<div tw="w-3" />
			{renderFilterButton("ads", "Ads")}
		</div>
	)
}

export default ChannelFilters
