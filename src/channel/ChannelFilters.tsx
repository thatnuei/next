import clsx from "clsx"
import type { ReactNode } from "react"
import Button from "../dom/Button"
import { useChannel, useChannelActions } from "./state"
import type { ChannelMode } from "./types"

interface Props {
	channelId: string
}

function ChannelFilters({ channelId, ...props }: Props) {
	const { mode, selectedMode } = useChannel(channelId)
	const { updateChannel } = useChannelActions()

	function buttonProps(mode: ChannelMode) {
		return {
			onClick: () => {
				updateChannel(channelId, (channel) => {
					channel.mode = mode
				})
			},
			active: selectedMode === mode,
		}
	}

	if (mode === "ads") {
		return (
			<div className="flex flex-row gap-3" role="radiogroup" {...props}>
				<ChannelFilterButton disabled>Chat</ChannelFilterButton>
				<ChannelFilterButton active>Ads</ChannelFilterButton>
				<ChannelFilterButton disabled>Both</ChannelFilterButton>
			</div>
		)
	}

	if (mode === "chat") {
		return (
			<div className="flex flex-row gap-3" role="radiogroup" {...props}>
				<ChannelFilterButton active>Chat</ChannelFilterButton>
				<ChannelFilterButton disabled>Ads</ChannelFilterButton>
				<ChannelFilterButton disabled>Both</ChannelFilterButton>
			</div>
		)
	}

	return (
		<div className="flex flex-row gap-3" role="radiogroup" {...props}>
			<ChannelFilterButton {...buttonProps("chat")}>Chat</ChannelFilterButton>
			<ChannelFilterButton {...buttonProps("ads")}>Ads</ChannelFilterButton>
			<ChannelFilterButton {...buttonProps("both")}>Both</ChannelFilterButton>
		</div>
	)
}

export default ChannelFilters

function ChannelFilterButton({
	children,
	active,
	disabled,
	onClick,
}: {
	children: ReactNode
	active?: boolean
	disabled?: boolean
	onClick?: () => void
}) {
	return (
		<Button
			className={clsx(
				"block transition-opacity whitespace-nowrap",
				active ? `opacity-100` : `opacity-50 hover:opacity-75`,
				disabled && "opacity-25 pointer-events-none",
			)}
			onClick={onClick ?? (() => {})}
			role="radio"
			aria-checked={active ?? false}
			aria-disabled={disabled ?? false}
		>
			{children}
		</Button>
	)
}
