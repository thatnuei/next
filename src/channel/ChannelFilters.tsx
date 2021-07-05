import Button from "../dom/Button"
import { useChannel, useChannelActions } from "./state"
import type { ChannelMode } from "./types"

interface Props {
	channelId: string
}

function ChannelFilters({ channelId, ...props }: Props) {
	const channel = useChannel(channelId)
	const { updateChannel } = useChannelActions()

	function setSelectedMode(mode: ChannelMode) {
		void updateChannel({ id: channelId, selectedMode: mode })
	}

	function renderFilterButton(mode: ChannelMode, label: string) {
		const isSelected = channel.selectedMode === mode

		return (
			<Button
				className={`block transition-opacity whitespace-nowrap ${
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
		<div className="flex flex-row gap-3" role="radiogroup" {...props}>
			{renderFilterButton("both", "Both")}
			{renderFilterButton("chat", "Chat")}
			{renderFilterButton("ads", "Ads")}
		</div>
	)
}

export default ChannelFilters
