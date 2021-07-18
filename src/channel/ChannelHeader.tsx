import * as React from "react"
import BBC from "../bbc/BBC"
import { useIsPublicChannel } from "../channelBrowser/state"
import ChatMenuButton from "../chat/ChatMenuButton"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { fadedButton, headerText2 } from "../ui/components"
import Drawer from "../ui/Drawer"
import DropdownMenu, {
	DropdownMenuButton,
	DropdownMenuItem,
	DropdownMenuPanel,
} from "../ui/DropdownMenu"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import Modal from "../ui/Modal"
import { screenQueries } from "../ui/screens"
import ChannelFilters from "./ChannelFilters"
import ChannelUserList from "./ChannelUserList"
import CopyChannelCodeButton from "./CopyChannelCodeButton"
import InviteUsersForm from "./InviteUsersForm"
import { useChannel, useChannelActions } from "./state"

interface Props {
	channelId: string
}

function ChannelHeader({ channelId }: Props) {
	const channel = useChannel(channelId)
	const isLargeScreen = useMediaQuery(screenQueries.large)
	const [inviteOpen, setInviteOpen] = React.useState(false)
	const isPublic = useIsPublicChannel(channelId)
	const { clearChannelMessages } = useChannelActions()

	return (
		<header className="flex flex-row items-center gap-3 p-3 bg-midnight-0">
			<ChatMenuButton />

			<Modal
				title="Channel Description"
				renderTrigger={(trigger) => (
					<Button title="Description" className={fadedButton} {...trigger}>
						<Icon which={icons.about} />
					</Button>
				)}
			>
				<div className="w-full h-full min-h-0 overflow-y-auto">
					<p className="p-4">
						<BBC text={channel.description} />
					</p>
				</div>
			</Modal>

			<div className="flex-1">
				<h1 className={headerText2}>{channel.title}</h1>
			</div>

			{isLargeScreen && <ChannelFilters channelId={channel.id} />}

			{!isLargeScreen && (
				<Drawer
					side="right"
					renderTrigger={(trigger) => (
						<Button title="User list" className={fadedButton} {...trigger}>
							<Icon which={icons.users} />
						</Button>
					)}
				>
					<div className="w-64 h-full">
						<ChannelUserList channelId={channelId} />
					</div>
				</Drawer>
			)}

			<DropdownMenu>
				<DropdownMenuButton>
					<Button title="More channel actions" className={fadedButton}>
						<Icon which={icons.more} />
					</Button>
				</DropdownMenuButton>
				<DropdownMenuPanel>
					{!isLargeScreen && (
						<div className="px-3 py-2 mb-1 bg-midnight-0">
							<ChannelFilters channelId={channel.id} />
						</div>
					)}

					<div className="flex flex-col bg-midnight-1">
						<DropdownMenuItem icon={<Icon which={icons.code} />}>
							<CopyChannelCodeButton channelId={channelId} />
						</DropdownMenuItem>

						<DropdownMenuItem icon={<Icon which={icons.clearMessages} />}>
							<button
								type="button"
								onClick={() => clearChannelMessages(channelId)}
							>
								Clear messages
							</button>
						</DropdownMenuItem>

						{!isPublic && (
							<DropdownMenuItem icon={<Icon which={icons.invite} />}>
								<button type="button" onClick={() => setInviteOpen(true)}>
									Invite
								</button>
							</DropdownMenuItem>
						)}
					</div>
				</DropdownMenuPanel>
			</DropdownMenu>

			<Modal
				title={`Invite to ${channel.title}`}
				open={inviteOpen}
				onOpenChange={setInviteOpen}
			>
				<InviteUsersForm channelId={channelId} />
			</Modal>
		</header>
	)
}

export default ChannelHeader
