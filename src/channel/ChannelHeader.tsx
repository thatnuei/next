import { AnimatePresence } from "framer-motion"
import { useObservable } from "micro-observables"
import * as React from "react"
import { useIdentity } from "../app/helpers"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { fadedButton, headerText2 } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import MenuItem from "../ui/MenuItem"
import Modal from "../ui/Modal"
import { useOverlay } from "../ui/overlay"
import Popover, { usePopover } from "../ui/Popover"
import { screenQueries } from "../ui/screens"
import ChannelFilters from "./ChannelFilters"
import { useChannel } from "./helpers"
import InviteUsersForm from "./InviteUsersForm"

type Props = {
	channelId: string
	onToggleDescription: () => void
	onShowUsers: () => void
}

function ChannelHeader({ channelId, onToggleDescription, onShowUsers }: Props) {
	const channel = useChannel(channelId)
	const title = useObservable(channel.title)
	const isPublic = useObservable(channel.isPublic)
	const ops = useObservable(channel.ops)

	const identity = useIdentity()

	const isLargeScreen = useMediaQuery(screenQueries.large)
	const menu = usePopover()
	const invite = useOverlay()

	function showMenu(event: React.MouseEvent<HTMLButtonElement>) {
		const target = event.currentTarget
		menu.showAt({
			x: target.offsetLeft,
			y: target.offsetTop + target.clientHeight,
		})
	}

	return (
		<header tw="flex flex-row items-center p-3 space-x-3 bg-midnight-0">
			<ChatMenuButton />

			<Button
				title="Description"
				tw={fadedButton}
				onClick={onToggleDescription}
			>
				<Icon which={icons.about} />
			</Button>

			<div tw="flex-1">
				<h1 tw={headerText2}>{title}</h1>
			</div>

			{isLargeScreen && <ChannelFilters channelId={channel.id} />}

			{!isLargeScreen && (
				<Button title="User list" tw={fadedButton} onClick={onShowUsers}>
					<Icon which={icons.users} />
				</Button>
			)}

			<Button title="More" tw={fadedButton} onClick={showMenu}>
				<Icon which={icons.more} />
			</Button>

			<AnimatePresence>
				{menu.value && (
					<Popover {...menu.props} tw="w-48 bg-midnight-2">
						{!isLargeScreen && (
							<ChannelFilters
								channelId={channel.id}
								tw="px-3 py-2 mb-1 bg-midnight-0"
							/>
						)}
						<div tw="flex flex-col bg-midnight-1">
							<MenuItem
								text="Copy code"
								icon={icons.code}
								onClick={() => {
									window.navigator.clipboard
										.writeText(channel.linkCode.get())
										.catch(console.error)
									menu.hide()
								}}
							/>
							<MenuItem
								text="Clear messages"
								icon={icons.clearMessages}
								onClick={() => {
									channel.clearMessages()
									menu.hide()
								}}
							/>
							{isPublic && ops.includes(identity) && (
								<MenuItem
									text="Invite"
									icon={icons.invite}
									onClick={() => {
										invite.show()
										menu.hide()
									}}
								/>
							)}
						</div>
					</Popover>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{invite.value && (
					<Modal
						onDismiss={invite.hide}
						title={`Invite to ${title}`}
						width={400}
						height={700}
					>
						<InviteUsersForm channelId={channelId} />
					</Modal>
				)}
			</AnimatePresence>
		</header>
	)
}

export default ChannelHeader
