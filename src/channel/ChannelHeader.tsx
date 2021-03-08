import { useObservable } from "micro-observables"
import * as React from "react"
import { css } from "twind/css"
import { useIdentity } from "../app/helpers"
import BBC from "../bbc/BBC"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { fadedButton, headerText2 } from "../ui/components"
import Dialog, {
	DialogButton,
	DialogDrawerPanel,
	DialogModalPanel,
} from "../ui/Dialog"
import DropdownMenu, {
	DropdownMenuButton,
	DropdownMenuItem,
	DropdownMenuPanel,
} from "../ui/DropdownMenu"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { screenQueries } from "../ui/screens"
import ChannelFilters from "./ChannelFilters"
import ChannelUserList from "./ChannelUserList"
import { useChannel } from "./helpers"
import InviteUsersForm from "./InviteUsersForm"

type Props = {
	channelId: string
}

function ChannelHeader({ channelId }: Props) {
	const channel = useChannel(channelId)
	const title = useObservable(channel.title)
	const isPublic = useObservable(channel.isPublic)
	const ops = useObservable(channel.ops)
	const description = useObservable(channel.description)
	const identity = useIdentity()
	const isLargeScreen = useMediaQuery(screenQueries.large)
	const [inviteOpen, setInviteOpen] = React.useState(false)

	const copyCodeToClipboard = () => {
		window.navigator.clipboard
			.writeText(channel.linkCode.get())
			.catch(console.error)
	}

	return (
		<header tw="flex flex-row items-center p-3 space-x-3 bg-midnight-0">
			<ChatMenuButton />

			<Dialog>
				<DialogButton>
					<Button title="Description" tw={fadedButton}>
						<Icon which={icons.about} />
					</Button>
				</DialogButton>
				<DialogModalPanel title="Channel Description">
					<div
						tw={`w-full h-full min-h-0 overflow-y-auto ${css({
							maxHeight: `calc(100vh - 8rem)`,
						})}`}
					>
						<p tw="p-4">
							<BBC text={description} />
						</p>
					</div>
				</DialogModalPanel>
			</Dialog>

			<div tw="flex-1">
				<h1 tw={headerText2}>{title}</h1>
			</div>

			{isLargeScreen && <ChannelFilters channelId={channel.id} />}

			{!isLargeScreen && (
				<Dialog>
					<DialogButton>
						<Button title="User list" tw={fadedButton}>
							<Icon which={icons.users} />
						</Button>
					</DialogButton>
					<DialogDrawerPanel side="right">
						<div tw="w-64 h-full">
							<ChannelUserList channel={channel} />
						</div>
					</DialogDrawerPanel>
				</Dialog>
			)}

			<DropdownMenu>
				<DropdownMenuButton>
					<Button title="More channel actions" tw={fadedButton}>
						<Icon which={icons.more} />
					</Button>
				</DropdownMenuButton>
				<DropdownMenuPanel>
					{!isLargeScreen && (
						<div tw="px-3 py-2 mb-1 bg-midnight-0">
							<ChannelFilters channelId={channel.id} />
						</div>
					)}

					<div tw="flex flex-col bg-midnight-1">
						<DropdownMenuItem icon={<Icon which={icons.code} />}>
							<button type="button" onClick={copyCodeToClipboard}>
								Copy code
							</button>
						</DropdownMenuItem>

						<DropdownMenuItem icon={<Icon which={icons.clearMessages} />}>
							<button type="button" onClick={() => channel.clearMessages()}>
								Clear messages
							</button>
						</DropdownMenuItem>

						{isPublic && ops.includes(identity) && (
							<DropdownMenuItem icon={<Icon which={icons.invite} />}>
								<button type="button" onClick={() => setInviteOpen(true)}>
									Invite
								</button>
							</DropdownMenuItem>
						)}
					</div>
				</DropdownMenuPanel>
			</DropdownMenu>

			<Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
				<DialogModalPanel title={`Invite to ${title}`}>
					<InviteUsersForm channelId={channelId} />
				</DialogModalPanel>
			</Dialog>
		</header>
	)
}

export default ChannelHeader
