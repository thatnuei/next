import { useObservable } from "micro-observables"
import { tw } from "twind"
import Button from "../dom/Button"
import { TagProps } from "../jsx/types"
import { useChannel } from "./helpers"
import { ChannelMode } from "./types"

type Props = {
	channelId: string
} & TagProps<"div">

function ChannelFilters({ channelId, ...props }: Props) {
	const channel = useChannel(channelId)
	const selectedMode = useObservable(channel.selectedMode)

	function setSelectedMode(mode: ChannelMode) {
		channel.selectedMode.set(mode)
	}

	function renderFilterButton(mode: ChannelMode, label: string) {
		const isSelected = selectedMode === mode

		const style = tw(
			tw`block transition-opacity whitespace-nowrap`,
			isSelected ? tw`opacity-100` : tw`opacity-50 hover:opacity-75`,
		)

		return (
			<Button
				className={style}
				onClick={() => setSelectedMode(mode)}
				role="radio"
				aria-checked={isSelected}
			>
				{label}
			</Button>
		)
	}

	return (
		<div className={tw`flex flex-row`} role="radiogroup" {...props}>
			{renderFilterButton("both", "Both")}
			<div className={tw`w-3`} />
			{renderFilterButton("chat", "Chat")}
			<div className={tw`w-3`} />
			{renderFilterButton("ads", "Ads")}
		</div>
	)
}

export default ChannelFilters
