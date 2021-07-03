import * as React from "react"
import BBC from "../bbc/BBC"
import { useIdentity } from "../chat/identityContext"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { useShowToast } from "../toast/state"
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
import InviteUsersForm from "./InviteUsersForm"
import { useChannel, useChannelActions } from "./state"

interface Props {
	channelId: string
}

function ChannelHeader({ channelId }: Props) {
	const channel = useChannel(channelId)
	const identity = useIdentity()
	const isLargeScreen = useMediaQuery(screenQueries.large)
	const [inviteOpen, setInviteOpen] = React.useState(false)
	const showToast = useShowToast()
	const { clearMessages } = useChannelActions()

	const isPublic = channel.id === channel.title

	const linkCode = isPublic
		? `[channel]${channelId}[/channel]`
		: `[session=${channelId}]${channel.title}[/session]`

	const copyCodeToClipboard = () => {
		window.navigator.clipboard.writeText(linkCode).catch(() => {
			showToast({
				content: "Copy to clipboard failed",
				type: "error",
				duration: 3000,
			})
		})
	}

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
						<ChannelUserList channel={channel} />
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
							<button type="button" onClick={copyCodeToClipboard}>
								Copy code
							</button>
						</DropdownMenuItem>

						<DropdownMenuItem icon={<Icon which={icons.clearMessages} />}>
							<button type="button" onClick={() => clearMessages(channelId)}>
								Clear messages
							</button>
						</DropdownMenuItem>

						{isPublic && channel.ops[identity] && (
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
