import { useObservable } from "micro-observables"
import { forwardRef } from "react"
import { tw } from "twind"
import ChannelBrowser from "../channelBrowser/ChannelBrowser"
import CharacterSummary from "../character/CharacterSummary"
import Button from "../dom/Button"
import { ComponentProps } from "../jsx/types"
import { useRootStore } from "../root/context"
import StatusUpdateForm from "../statusUpdate/StatusUpdateForm"
import { fadedButton } from "../ui/components"
import Dialog, { DialogButton, DialogModalPanel } from "../ui/Dialog"
import Icon, { IconProps } from "../ui/Icon"
import * as icons from "../ui/icons"
import RoomTabList from "./RoomTabList"

export default function ChatNav() {
	const root = useRootStore()
	const identity = useObservable(root.appStore.identity)
	return (
		<nav className={tw`flex h-full bg-midnight-2`}>
			<div className={tw`flex flex-col`}>
				<Dialog>
					<DialogButton>
						<NavAction icon={icons.list} title="Browse channels" />
					</DialogButton>
					<DialogModalPanel title="Channel Browser">
						<ChannelBrowser />
					</DialogModalPanel>
				</Dialog>

				<Dialog>
					<DialogButton>
						<NavAction icon={icons.updateStatus} title="Update your status" />
					</DialogButton>
					<DialogModalPanel title="Update Status">
						<StatusUpdateForm />
					</DialogModalPanel>
				</Dialog>

				<NavAction
					icon={icons.users}
					title="See online friends and bookmarks"
				/>

				<NavAction icon={icons.about} title="About next" />

				<div className={tw`flex-1`} />

				<NavAction
					icon={icons.logout}
					title="Log out"
					onClick={root.appStore.leaveChat}
				/>
			</div>
			<div className={tw`flex flex-col w-56 overflow-y-auto bg-midnight-1`}>
				<CharacterSummary
					name={identity}
					className={tw`p-3 mb-1 bg-midnight-0`}
				/>
				<div className={tw`flex-1`}>
					<RoomTabList />
				</div>
			</div>
		</nav>
	)
}

type NavActionProps = ComponentProps<typeof Button> & {
	icon: IconProps["which"]
}

const NavAction = forwardRef(function NavAction(
	{ icon, ...props }: NavActionProps,
	ref: React.Ref<HTMLButtonElement>,
) {
	return (
		<Button className={tw`${fadedButton} block p-3`} {...props} ref={ref}>
			<Icon which={icon} />
		</Button>
	)
})
