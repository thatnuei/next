import * as React from "react"
import { tw } from "twind"
import Button from "../dom/Button"
import { fadedButton } from "../ui/components"
import { ellipsize } from "../ui/helpers"
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

	const unreadHighlight = tw`bg-green-500 bg-opacity-20`

	const activeStateStyle = (() => {
		if (props.isActive) return tw`bg-midnight-0`
		if (props.isUnread) return [inactiveHoverReveal, unreadHighlight]
		return inactiveHoverReveal
	})()

	return (
		<div tw={`flex flex-row items-center transition ${activeStateStyle}`}>
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
				<Icon which={close} />
			</Button>
		</div>
	)
}

export default RoomTab
