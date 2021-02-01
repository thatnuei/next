import * as React from "react"
import { tw } from "twind"
import Button from "../dom/Button"
import { fadedButton } from "../ui/components"
import { ellipsize, transition } from "../ui/helpers"
import Icon from "../ui/Icon"
import { close } from "../ui/icons"

export type RoomTabProps = {
	title: string
	icon: React.ReactNode
	isActive: boolean
	isUnread: boolean
	onClick: () => void
	onClose: () => void
}

function RoomTab(props: RoomTabProps) {
	const inactiveHoverReveal = tw`opacity-50 hover:opacity-100`

	const unreadHighlight = tw`bg-green-faded`

	const activeStateStyle = (() => {
		if (props.isActive) return tw`bg-background-0`
		if (props.isUnread) return [inactiveHoverReveal, unreadHighlight]
		return inactiveHoverReveal
	})()

	return (
		<div
			className={tw([
				tw`flex flex-row items-center`,
				activeStateStyle,
				transition,
			])}
		>
			<Button
				className={tw([tw`flex flex-row items-center flex-1 p-2`, ellipsize])}
				onClick={props.onClick}
				role="link"
			>
				{props.icon}
				<div
					className={tw([tw`flex-1 ml-2`, ellipsize])}
					dangerouslySetInnerHTML={{ __html: props.title }}
				/>
			</Button>
			<Button
				className={tw([fadedButton, tw`p-2`])}
				title="Close"
				onClick={props.onClose}
			>
				<Icon which={close} className={tw`w-5 h-5`} />
			</Button>
		</div>
	)
}

export default RoomTab
